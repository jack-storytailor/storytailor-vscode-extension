/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import {
  // Diagnostic, DiagnosticSeverity, 
	IPCMessageReader, IPCMessageWriter, createConnection, IConnection, TextDocuments, InitializeResult, ExecuteCommandParams,
  TextDocumentSyncKind,
  TextDocumentChangeEvent,
  TextDocumentPositionParams,
  CompletionItem,
  TextDocument,
  Diagnostic,
  DiagnosticSeverity,
  CompletionItemKind
} from 'vscode-languageserver';

import { ICodeToken } from 'storyscript/out/shared/ICodeToken';
import { CodeTokenType } from 'storyscript/out/shared/CodeTokenType';
import { stsTokenizer } from 'storyscript/out/tokenizing/stsTokenizer';
import { clearTimeout } from 'timers';

let completions: { [key: string]: CompletionItem[] } = {}
let allCompletions: CompletionItem[] = [];
let timeoutIds: { [key: string]: NodeJS.Timer } = {}

// Create a connection for the server. The connection uses Node's IPC as a transport
let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));
// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments = new TextDocuments();
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

interface Settings {
  storyscript: ExampleSettings;
}
interface ExampleSettings {
  isMultifileCompletions: boolean;
}

let isMultifileCompletions: boolean;

connection.onDidChangeConfiguration((change) => {
  let settings = <Settings>change.settings;
  isMultifileCompletions = settings.storyscript.isMultifileCompletions;
});

// connection.sendDiagnostics({uri: })

// After the server has started the client sends an initialize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilities. 
// let workspaceRoot: string;
connection.onInitialize((params): InitializeResult => {
	// const workspaceRoot = params.rootPath;

	return {
		capabilities: {
			// Tell the client that the server works in FULL text document sync mode
			textDocumentSync: TextDocumentSyncKind.Full,
			// Tell the client that the server support code complete
			completionProvider: {
        resolveProvider: false,
        triggerCharacters: ["*", ".", " "]
      },
		}
	}
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((change: TextDocumentChangeEvent) => {
  let uri = change.document.uri;
  let docText = change.document.getText();

  // get prev timeout id
  if (timeoutIds[uri]) {
    clearTimeout(timeoutIds[uri]);
  }
  timeoutIds[uri] = setTimeout(updateCompletions, 1000, uri, docText);
});

documents.onDidOpen((change: TextDocumentChangeEvent) => {
  let uri = change.document.uri;
  let docText = change.document.getText();

  // get prev timeout id
  if (timeoutIds[uri]) {
    clearTimeout(timeoutIds[uri]);
  }
  timeoutIds[uri] = setTimeout(updateCompletions, 1000, uri, docText);
});

function updateCompletions(uri: string, docText: string) {
  let tokens = stsTokenizer.tokenizeCode(docText);
  let result: CompletionItem[] = [];
  if (tokens) {
    let strings = tokens.map((token: ICodeToken) => {
      if (token.type !== CodeTokenType.Word) {
        return undefined;
      }

      return token.value;
    });

    strings = strings.filter((str: string) => {
      if (str) {
        return str;
      }

      return undefined;
    });

    let set = new Set(strings);
    let filteredStrings = [];
    set.forEach((str: string) => {
      filteredStrings = [
        ...filteredStrings,
        str
      ];
    });

    result = filteredStrings.map((str: string): CompletionItem => {
      return {
        label: str,
        kind: CompletionItemKind.Text,
        data: str
      };
    });

    // save result
    completions = {
      ...completions,
      [uri]: result
    }
  }

  let allWords: CompletionItem[] = [];
  let newCompletions = {}
  for (const fileId in completions) {
    if (!documents.get(fileId)) {
      continue;
    }

    if (!isMultifileCompletions && fileId !== uri) {
      continue;
    }

    let fileWords: CompletionItem[] = completions[fileId];
    if (fileWords) {
      allWords = [...allWords, ...fileWords];
    }

    newCompletions = {
      ...newCompletions,
      [fileId]: fileWords
    }
  }

  completions = newCompletions;

  let map = new Map<string, CompletionItem>(allWords.map((completion: CompletionItem): [string, CompletionItem] => {
    return [completion.label, completion];
  }));

  allWords = Array.from(map.values());

  allCompletions = allWords;
}


// This handler provides the initial list of the completion items.
connection.onCompletion((_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
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
	// 		label: 'StoryScript',
	// 		kind: CompletionItemKind.Text,
	// 		data: 3
	// 	},
	// ];

  // return result;
});

// This handler resolve additional information for the item selected in  the completion list.
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
  if (item.data === 1) {
		item.detail = 'TypeScript details',
		item.documentation = 'TypeScript documentation'
	} else if (item.data === 2) {
		item.detail = 'JavaScript details',
		item.documentation = 'JavaScript documentation'
	} else if (item.data === 3) {
		item.detail = 'StoryScript details',
		item.documentation = 'StoryScript documentation'
	}
	return item;
});

// Listen on the connection
connection.listen();
