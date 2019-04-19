export interface ILoaderContext {
  _compiler: any;
  _module: any;
  /**
   * Make this loader result cacheable. By default it’s not cacheable.
   *
   * A cacheable loader must have a deterministic result, when inputs and dependencies haven’t changed. This means the loader shouldn’t have other dependencies than specified with this.addDependency. Most loaders are deterministic and cacheable.
   */
  cacheable: () => void;
  /**
   * The directory of the module. Can be used as context for resolving other stuff.
   */
  context: string;
  /**
   * The root directory of the Webpack project.
   * Starting with webpack 4, the formerly `this.options.context` is provided as `this.rootContext`.
   */
  rootContext: string;
  /**
   * The resolved request string.
   * eg: "/abc/loader1.js?xyz!/abc/node_modules/loader2/index.js!/abc/resource.js?rrr"
   */
  request: string;
  /**
   * The query of the request for the current loader.
   */
  query: string;
  /**
   * A data object shared between the pitch and the normal phase.
   */
  data: Object;
  async: () => any;
  /**
   * The resource part of the request, including query.
   * eg: "/abc/resource.js?rrr"
   */
  resource: string;
  /**
   * The resource file.
   * eg: "/abc/resource.js"
   */
  resourcePath: string;
  /**
   * The query of the resource.
   * eg: "?rrr"
   */
  resourceQuery: string;
  /**
   * Resolve a request like a require expression.
   */
  resolve: (
    context: string,
    request: string,
    callback: (err: Error, result: string) => void
  ) => void;
  /**
   * Resolve a request like a require expression.
   */
  resolveSync: (context: string, request: string) => string;
  /**
   * Add a file as dependency of the loader result in order to make them watchable.
   */
  addDependency: (file: string) => void;
  /**
   * Add a directory as dependency of the loader result.
   */
  addContextDependency: (directory: string) => void;
  /**
   * Remove all dependencies of the loader result. Even initial dependencies and these of other loaders. Consider using pitch.
   */
  clearDependencies: () => void;
  /**
   * Emit a warning.
   */
  emitWarning: (message: Error) => void;
  /**
   * Emit an error.
   */
  emitError: (message: Error) => void;
  /**
   * Emit a file. This is webpack-specific
   */
  emitFile: (fileName: string, text: string) => void; // unused
}
