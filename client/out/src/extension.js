/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const vscode = require("vscode");
const vscode_1 = require("vscode");
const main_1 = require("vscode-languageclient/lib/main");
const fsUtils = require("storyscript/out/fileSystem/fsUtils");
const compileUtils = require("storyscript/out/compilation/compileUtils");
let storyscriptPreviewPanel = undefined;
let storyscriptPreviewHtmlTemplate = undefined;
var configFields;
(function (configFields) {
    configFields["storyscriptConfigPath"] = "storyscriptConfigPath";
    configFields["typescriptConfigPath"] = "typescriptConfigPath";
    configFields["previewHtmlTemplatePath"] = "previewHtmlTemplatePath";
})(configFields || (configFields = {}));
let defaultSettings = {
    storyscriptConfigPath: 'stsconfig.json',
    typescriptConfigPath: 'tsconfig.json',
    previewHtmlTemplatePath: undefined,
};
let settings = Object.assign({}, defaultSettings);
let extensionContext = undefined;
let diagnosicCollection = undefined;
const initShowPreview = (context) => {
    initStoryscriptWebviewPanel();
    let disposable = vscode.commands.registerCommand('extension.previewStoryscript', () => {
        storyscriptPreviewPanel.reveal(vscode.ViewColumn.Two, true);
    });
    context.subscriptions.push(disposable);
};
// let diagnostics = vscode.languages.getDiagnostics()
const stsCompile = () => {
    let configPath = path.resolve(vscode.workspace.rootPath, settings.storyscriptConfigPath);
    let tsConfigPath = path.resolve(vscode.workspace.rootPath, settings.typescriptConfigPath);
    console.log('sts config path', configPath, 'ts config path', tsConfigPath);
    let compileRequest = {
        configPath: configPath,
        tsConfigPath: tsConfigPath,
        filePath: undefined,
        output: undefined
    };
    let compileResult = compileUtils.compile(compileRequest);
    if (compileResult) {
        diagnosicCollection.clear();
        let sortedDiagnostics = compileResult.sortedDiagnostics;
        if (sortedDiagnostics) {
            for (const filePath in sortedDiagnostics) {
                if (sortedDiagnostics.hasOwnProperty(filePath)) {
                    let uri = vscode.Uri.file(filePath);
                    const fileDiagnostics = sortedDiagnostics[filePath];
                    let diagnostics = [];
                    for (let k = 0; k < fileDiagnostics.length; k++) {
                        const fDiag = fileDiagnostics[k];
                        let fDiagStart = fDiag.range.start || { line: 0, column: 0, symbol: 0 };
                        let fDiagEnd = fDiag.range.start || { line: 0, column: 0, symbol: 0 };
                        let fDiagRange = new vscode.Range(new vscode.Position(fDiagStart.line, fDiagStart.column), new vscode.Position(fDiagEnd.line, fDiagEnd.column));
                        let diag = new vscode.Diagnostic(fDiagRange, fDiag.message, fDiag.severity);
                        diagnostics = [
                            ...diagnostics,
                            diag
                        ];
                    }
                    diagnosicCollection.set(uri, diagnostics);
                }
            }
        }
    }
    console.log('compilation ends with result', compileResult);
    return compileResult;
};
const stsCompileAndPreview = () => {
    if (!storyscriptPreviewPanel) {
        initStoryscriptWebviewPanel();
    }
    // update document content
    storyscriptPreviewPanel.webview.html = getStoryscriptPreviewHtml();
    // textDocProvider.update(previewUri);
    vscode.commands.executeCommand('extension.previewStoryscript').then((success) => { }, (reason) => { vscode.window.showErrorMessage(reason); });
};
const stringFormat = function (template) {
    var args = arguments;
    if (!template || !args || args.length === 0) {
        return template;
    }
    return template.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match;
    });
};
const getPreviewHtmlTemplate = () => {
    try {
        let templatePath = settings.previewHtmlTemplatePath;
        if (templatePath) {
            // check have we already loaded that file
            if (storyscriptPreviewHtmlTemplate && storyscriptPreviewHtmlTemplate.length > 0) {
                return storyscriptPreviewHtmlTemplate;
            }
            templatePath = path.resolve(vscode.workspace.rootPath, templatePath);
            if (fs.existsSync(templatePath)) {
                let template = fs.readFileSync(templatePath, 'utf8').toString();
                // storyscriptPreviewHtmlTemplate = template || undefined;
                return template;
            }
        }
    }
    catch (error) {
        console.error(error);
    }
    return `
    <html>
    <head>
      <title>\${title}</title>
    
      <style>
        .data { white-space: pre-wrap; }
      </style>
    </head>
  
    <body>
      <body class="data">
        \${documentContent}
      </body>
    </body>
  </html>
      `;
};
const getStoryscriptPreviewHtml = () => {
    let documentContent = getStoryscriptPreviewText();
    let title = 'Preview Story';
    let template = getPreviewHtmlTemplate();
    try {
        let html = template
            .replace(/\$\{title\}/, title)
            .replace(/\$\{documentContent\}/, documentContent);
        console.log(html);
        return html;
    }
    catch (error) {
        console.error(error);
    }
    return `
<html>
  <head>
    <title>${title}</title>
  
    <style>
      .data { white-space: pre-wrap; }
    </style>
  </head>

  <body>
    <body class="data">
      ${documentContent.split('\n').map((str) => `<div> ${str} &nbsp;</div>`).join('')}
    </body>
  </body>
</html>
  `;
};
const getStoryscriptPreviewText = () => {
    let compileResult = stsCompile();
    if (!compileResult || !compileResult.config) {
        return `No Storyscript config found;\r\n${compileResult}`;
    }
    let activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor) {
        let fileName = activeTextEditor.document.fileName;
        let workspaceFolder = vscode.workspace.rootPath;
        let configFileName = compileResult.request.configPath || workspaceFolder + '/' + settings.storyscriptConfigPath;
        configFileName = path.normalize(configFileName);
        let outputFileName = workspaceFolder + '/story output.txt';
        if (fileName.endsWith('.sts')) {
            try {
                // execute 'storyscript/out/index.js workspaceFolder fileName configFileName outputFileName
                let child_process = require('child_process');
                let storyscriptJsFile = require.resolve('storyscript/out/printer.js');
                let relativeSourceFileName = fsUtils.getRelativeFileName(fileName, compileResult.config.sourceRoot);
                relativeSourceFileName = path.dirname(relativeSourceFileName) + '/' + path.basename(relativeSourceFileName, path.extname(relativeSourceFileName)) + '.js';
                let relativeOutputFileName = fsUtils.getRelativeFileName(outputFileName, compileResult.config.sourceRoot);
                let command = `node "${storyscriptJsFile}" "${configFileName}" "${relativeSourceFileName}" "${relativeOutputFileName}"`;
                console.log('executing ', command, '...');
                let execResult = child_process.execSync(command).toString();
                console.log('execute result is', execResult);
                let outputFileContent = fs.readFileSync(outputFileName).toString();
                return outputFileContent;
            }
            catch (error) {
                console.error(error);
            }
        }
    }
    return "can't resolve preview...";
};
const initExampleProject = () => {
    // INSERT CONFIRMATION
    vscode.window.showWarningMessage(`This action will copy example project to your root folder.
    Files in folder '${vscode.workspace.rootPath}' may be overriden. Are you sure?`, `Yes`, `No`).then((val) => {
        if (val && val === `Yes`) {
            let targetPath = path.normalize(vscode.workspace.rootPath);
            let sourcePath = path.normalize(__dirname + '/../../lib/example-project');
            fsUtils.mkDirByPathSync(targetPath);
            fsUtils.copyDirectory(sourcePath, targetPath);
        }
    });
};
const updateNodeModules = () => {
    let targetPath = path.normalize(vscode.workspace.rootPath + '/node_modules/storyscript');
    let storyscriptPath = require.resolve('storyscript');
    storyscriptPath = path.dirname(storyscriptPath);
    fsUtils.mkDirByPathSync(targetPath);
    fsUtils.copyDirectory(storyscriptPath, targetPath);
};
const insertText = (text, isMoveCursor) => {
    if (!vscode.window.activeTextEditor) {
        vscode.window.showInformationMessage('Open a file first to manipulate text selections');
        return;
    }
    let editor = vscode.window.activeTextEditor;
    let selection = editor.selection;
    if (selection) {
        editor.edit(function (edit) {
            edit.insert(selection.start, text);
        })
            .then((value) => {
            if (value && isMoveCursor) {
                editor.selection = new vscode.Selection(new vscode.Position(selection.start.line, selection.start.character + 1), new vscode.Position(selection.start.line, selection.start.character + 1));
            }
        });
    }
};
const initCommands = (context) => {
    vscode.commands.registerCommand('extension.updateNodeModules', updateNodeModules);
    vscode.commands.registerCommand('extension.initExampleProject', initExampleProject);
};
const initStsCompileCommand = (context) => {
    context.subscriptions.push(vscode.commands.registerCommand('extension.stsCompile', () => {
        try {
            stsCompile();
            vscode.window.showInformationMessage(`storyscript: Compile done`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error during executing command Compile: ${error}`);
        }
    }));
};
const initStsCompileAndPreviewCommand = (context) => {
    context.subscriptions.push(vscode.commands.registerCommand('extension.stsCompileAndPreview', () => {
        try {
            stsCompileAndPreview();
            vscode.window.showInformationMessage(`storyscript: Compile And Preview done`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error during executing command Compile And Preview: ${error}`);
        }
    }));
};
const initInsertTextCommands = (context) => {
    // let insertCommands: {command: string, text: string, isMoveCursor?: boolean}[] = [
    //   {
    //     command: 'extension.sts_insert_{',
    //     text: '{}',
    //     isMoveCursor: true,
    //   },
    //   {
    //     command: 'extension.sts_insert_}',
    //     text: '}'
    //   },
    //   {
    //     command: 'extension.sts_insert_[',
    //     isMoveCursor: true,
    //     text: '[]'
    //   },
    //   {
    //     command: 'extension.sts_insert_]',
    //     text: ']'
    //   },
    //   {
    //     command: 'extension.sts_insert_>>',
    //     text: '>>'
    //   },
    //   {
    //     command: 'extension.sts_insert_<<',
    //     text: '<<'
    //   },
    // ]
    // insertCommands.map((command) => {
    //   const cmd: string = command.command;
    //   const txt: string = command.text;
    //   const isMoveCursor: boolean = command.isMoveCursor === true;
    //   const disposable = vscode.commands.registerCommand(cmd, () => insertText(txt, isMoveCursor));
    //   context.subscriptions.push(disposable);
    // });
};
const initLanguageServer = (context) => {
    // The server is implemented in node
    let serverModule = context.asAbsolutePath(path.join('server', 'server.js'));
    // The debug options for the server
    let debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions = {
        run: { module: serverModule, transport: main_1.TransportKind.ipc },
        debug: { module: serverModule, transport: main_1.TransportKind.ipc, options: debugOptions }
    };
    // Options to control the language client
    let clientOptions = {
        // Register the server for plain text documents
        documentSelector: [{ scheme: 'file', language: 'storyscript' }],
        synchronize: {
            // Synchronize the setting section 'languageServerExample' to the server
            configurationSection: 'storyscript',
            // Notify the server about file changes to '.clientrc files contain in the workspace
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/.clientrc')
        }
    };
    // Create the language client and start the client.
    let disposable = new main_1.LanguageClient('storyScript', 'storyscript language server', serverOptions, clientOptions).start();
    // Push the disposable to the context's subscriptions so that the 
    // client can be deactivated on extension deactivation
    context.subscriptions.push(disposable);
};
const readConfiguration = () => {
    let configSectionName = 'storyscript';
    let configSection = vscode_1.workspace.getConfiguration(configSectionName);
    if (configSection) {
        if (!configSection.has(configFields.storyscriptConfigPath)) {
            configSection.update(configSectionName + '.' + configFields.storyscriptConfigPath, defaultSettings.storyscriptConfigPath);
        }
        if (!configSection.has(configFields.typescriptConfigPath)) {
            configSection.update(configSectionName + '.' + configFields.typescriptConfigPath, defaultSettings.typescriptConfigPath);
        }
        if (!configSection.has(configFields.storyscriptConfigPath)) {
            configSection.update(configSectionName + '.' + configFields.storyscriptConfigPath, defaultSettings.storyscriptConfigPath);
        }
        let stsConfigPath = configSection.get(configFields.storyscriptConfigPath) || defaultSettings.storyscriptConfigPath;
        let tsConfigPath = configSection.get(configFields.typescriptConfigPath) || defaultSettings.typescriptConfigPath;
        let previewHtmlTemplatePath = configSection.get(configFields.previewHtmlTemplatePath) || defaultSettings.previewHtmlTemplatePath;
        settings = {
            storyscriptConfigPath: stsConfigPath,
            typescriptConfigPath: tsConfigPath,
            previewHtmlTemplatePath: previewHtmlTemplatePath
        };
    }
    else {
        settings = Object.assign({}, defaultSettings);
    }
    console.log('settings are ', settings);
};
function initStoryscriptWebviewPanel() {
    storyscriptPreviewPanel = vscode.window.createWebviewPanel('storyscript-preview', 'Preview story', {
        preserveFocus: true,
        viewColumn: vscode.ViewColumn.Two
    }, {
        enableScripts: false,
    });
    storyscriptPreviewPanel.onDidDispose(() => {
        storyscriptPreviewPanel = undefined;
    });
}
function activate(context) {
    readConfiguration();
    initCommands(context);
    initInsertTextCommands(context);
    initLanguageServer(context);
    initStsCompileCommand(context);
    initStsCompileAndPreviewCommand(context);
    initShowPreview(context);
    extensionContext = context;
    diagnosicCollection = vscode.languages.createDiagnosticCollection("storyscript");
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map