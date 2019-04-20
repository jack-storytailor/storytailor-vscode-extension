"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loaderUtils = require("loader-utils");
const storytailor = require("storytailor/out");
const jsCompiler = require("storytailor/out/compilation/jsCompiler");
const astParser = require("storytailor/out/parsing/astParser2");
function default_1(source) {
    try {
        const loaderContext = this;
        const loaderOptions = loaderUtils.getOptions(loaderContext);
        const config = loaderOptions.stsConfig;
        if (!loaderOptions.stsConfig) {
            this.emitError(new Error("Can't extract stsConfig from options! " + loaderContext.resourcePath));
            return undefined;
        }
        let sourceFileName = loaderContext.resourcePath;
        let tokens = storytailor.stsTokenizer.stsTokenizer.tokenizeCode(source);
        if (!tokens || tokens.length <= 0) {
            this.emitError(new Error("Can't parse tokens " + sourceFileName));
            return undefined;
        }
        let astResult = astParser.parseModule(tokens, sourceFileName);
        if (!astResult || !astResult.result) {
            this.emitError(new Error("Can't parse ast " + sourceFileName));
            return undefined;
        }
        let astModule = astResult.result;
        if (!astModule) {
            this.emitError(new Error("ast of file parsed, but it's empty. file: " + sourceFileName));
            return undefined;
        }
        let compileRequest = {
            ast: [astModule],
            environmentPath: config.environmentPath,
            outputRoot: config.javascriptOutputRoot,
            sourceFileName: sourceFileName,
            sourceRoot: config.sourceRoot,
            targetFileName: sourceFileName
        };
        let compileJsResult = jsCompiler.compile(compileRequest);
        if (!compileJsResult) {
            this.emitError(new Error("can't compile javascript from sts file " + sourceFileName));
            return undefined;
        }
        // prepare result
        let result = compileJsResult.javascript;
        return result;
    }
    catch (error) {
        this.emitError(error);
    }
}
exports.default = default_1;
;
//# sourceMappingURL=stsLoader.js.map