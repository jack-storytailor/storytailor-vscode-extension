import * as loaderUtils from "loader-utils";
import * as storytailor from "storytailor/out";
import * as jsCompiler from 'storytailor/out/compilation/jsCompiler';
import * as astParser from 'storytailor/out/parsing/astParser2';
import { ILoaderContext } from "./types";
import { IStsConfig } from "storytailor/out/shared/IStsConfig";

interface ILoaderOptions {
  stsConfig: IStsConfig;
}

export default function(this: ILoaderContext, source: string): string {
  try {
    const loaderContext = this;
    const loaderOptions: ILoaderOptions = loaderUtils.getOptions(loaderContext);
    const config = loaderOptions.stsConfig;
    let sourceFileName = loaderContext.resourcePath;
  
    let tokens = storytailor.stsTokenizer.stsTokenizer.tokenizeCode(source);
    if (!tokens || tokens.length <= 0)
    {
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
  
    let compileRequest: jsCompiler.ICompileFileRequest = {
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
  } catch (error) {
    this.emitError(error);    
  }
};

