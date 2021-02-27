
export interface IInstallOptions {

   /** A string to prefix system component names with when registering.
    * Example:
    * function install(app, opt) {
    *    app.component(`${opt.componentPrefix}config`, myPluginConfigComponent);
    * }
   */
   componentPrefix: string;
}