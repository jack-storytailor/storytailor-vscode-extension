/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const CodeTokenType_1 = require("storytailor/out/shared/CodeTokenType");
const stsTokenizer_1 = require("storytailor/out/tokenizing/stsTokenizer");
const timers_1 = require("timers");
let completions = {};
let allCompletions = [];
let timeoutIds = {};
// Create a connection for the server. The connection uses Node's IPC as a transport
let connection = vscode_languageserver_1.createConnection(new vscode_languageserver_1.IPCMessageReader(process), new vscode_languageserver_1.IPCMessageWriter(process));
// Create a simple text document manager. The text document manager
// supports full document sync only
let documents = new vscode_languageserver_1.TextDocuments();
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
let isMultifileCompletions;
connection.onDidChangeConfiguration((change) => {
    let settings = change.settings;
    isMultifileCompletions = settings.storytailor.isMultifileCompletions;
});
// connection.sendDiagnostics({uri: })
// After the server has started the client sends an initialize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilities. 
// let workspaceRoot: string;
connection.onInitialize((params) => {
    // const workspaceRoot = params.rootPath;
    return {
        capabilities: {
            // Tell the client that the server works in FULL text document sync mode
            textDocumentSync: vscode_languageserver_1.TextDocumentSyncKind.Full,
            // Tell the client that the server support code complete
            completionProvider: {
                resolveProvider: false,
                triggerCharacters: ["*", ".", " "]
            },
        }
    };
});
// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((change) => {
    let uri = change.document.uri;
    let docText = change.document.getText();
    // get prev timeout id
    if (timeoutIds[uri]) {
        timers_1.clearTimeout(timeoutIds[uri]);
    }
    timeoutIds[uri] = setTimeout(updateCompletions, 1000, uri, docText);
});
documents.onDidOpen((change) => {
    let uri = change.document.uri;
    let docText = change.document.getText();
    // get prev timeout id
    if (timeoutIds[uri]) {
        timers_1.clearTimeout(timeoutIds[uri]);
    }
    timeoutIds[uri] = setTimeout(updateCompletions, 1000, uri, docText);
});
function updateCompletions(uri, docText) {
    let tokens = stsTokenizer_1.stsTokenizer.tokenizeCode(docText);
    let result = [];
    if (tokens) {
        let strings = tokens.map((token) => {
            if (token.type !== CodeTokenType_1.CodeTokenType.Word) {
                return undefined;
            }
            return token.value;
        });
        strings = strings.filter((str) => {
            if (str) {
                return str;
            }
            return undefined;
        });
        let set = new Set(strings);
        let filteredStrings = [];
        set.forEach((str) => {
            filteredStrings = [
                ...filteredStrings,
                str
            ];
        });
        result = filteredStrings.map((str) => {
            return {
                label: str,
                kind: vscode_languageserver_1.CompletionItemKind.Text,
                data: str
            };
        });
        // save result
        completions = Object.assign({}, completions, { [uri]: result });
    }
    let allWords = [];
    let newCompletions = {};
    for (const fileId in completions) {
        if (!documents.get(fileId)) {
            continue;
        }
        if (!isMultifileCompletions && fileId !== uri) {
            continue;
        }
        let fileWords = completions[fileId];
        if (fileWords) {
            allWords = [...allWords, ...fileWords];
        }
        newCompletions = Object.assign({}, newCompletions, { [fileId]: fileWords });
    }
    completions = newCompletions;
    let map = new Map(allWords.map((completion) => {
        return [completion.label, completion];
    }));
    allWords = Array.from(map.values());
    allCompletions = allWords;
}
// This handler provides the initial list of the completion items.
connection.onCompletion((_textDocumentPosition) => {
    const uri = _textDocumentPosition.textDocument.uri;
    let result = completions[uri];
    if (!result) {
        const doc = documents.get(uri);
        if (doc) {
            updateCompletions(uri, doc.getText());
        }
    }
    result = allCompletions; //completions[uri];
    return result;
    // The pass parameter contains the position of the text document in 
    // which code complete got requested. For the example we ignore this
    // info and always provide the same completion items.
    // const result = [
    // 	{
    // 		label: 'TypeScript',
    // 		kind: CompletionItemKind.Text,
    // 		data: 1
    // 	},
    // 	{
    // 		label: 'JavaScript',
    // 		kind: CompletionItemKind.Text,
    // 		data: 2
    // 	},
    // 	{
    // 		label: 'storytailor',
    // 		kind: CompletionItemKind.Text,
    // 		data: 3
    // 	},
    // ];
    // return result;
});
// This handler resolve additional information for the item selected in  the completion list.
connection.onCompletionResolve((item) => {
    if (item.data === 1) {
        item.detail = 'TypeScript details',
            item.documentation = 'TypeScript documentation';
    }
    else if (item.data === 2) {
        item.detail = 'JavaScript details',
            item.documentation = 'JavaScript documentation';
    }
    else if (item.data === 3) {
        item.detail = 'StoryTailor details',
            item.documentation = 'StoryTailor documentation';
    }
    return item;
});
// Listen on the connection
connection.listen();
//# sourceMappingURL=server.js.map