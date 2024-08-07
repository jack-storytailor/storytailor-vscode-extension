let __env = require(`\.\.\\src/environment`);
let __text = [];
let __context = { __text };
let __serializer = __env.getSerializer();

import * as system from __context[`./system`];
__context = {
	...__context, 
	...__context.system, 
	__text : __context.__text
};
__context.__text.push(``);
__context.__text.push(`# storytailor-vscode`);
__context.__text.push(`extension for vscode that provides support for the storytailor programming language`);
__context.__text.push(``);
__context.__text.push(`note that this is an experimental build, so some rules may change`);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.hyperlink("https://github.com/jack-storytailor/StorytailorOrigins/blob/master/Instruction.md", "Storytailor instruction (rus)"), '\r\n' )}`);
__context.__text.push(``);
__context.__text.push(`###This readme file was written on storytailor`);
__context.__text.push(``);
__context.__text.push(`# Getting started`);
__context.__text.push(``);
__context.__text.push(`The easiest way to start working is to open empty folder inside vscode and copy to that folder example project. To do that`);
__context.__text.push(``);
__context.__text.push(`Open empty folder`);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.localPhoto("vscode_empty.png", "Empty folder"), '\r\n' )}`);
__context.__text.push(``);
__context.__text.push(`Right-click on your project root folder and choose "Initialize example project in a working root" from dropdown menu`);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.localPhoto("init_example_project.png", "init example project"), '\r\n' )}`);
__context.__text.push(``);
__context.__text.push(`This operation copies example project to your root folder. Keep in mind that this command will override corresponding files if any. `);
__context.__text.push(``);
__context.__text.push(`Confirm copying`);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.localPhoto("confirm_init_example_project.png", "Confirm copying"), '\r\n' )}`);
__context.__text.push(``);
__context.__text.push(`Test project has been copied to your root folder. Structure of your project should look similar to this:`);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.localPhoto("example_project_created.png", "example prject created"), '\r\n' )}`);
__context.__text.push(``);
__context.__text.push(`Install node modules. To do that`);
__context.__text.push(``);
__context.__text.push(`Open terminal`);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.localPhoto("open_terminal.png", "open terminal"), '\r\n' )}`);
__context.__text.push(``);
__context.__text.push(`Type command "npm install" or "npm i" into terminal and press "ENTER"`);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.localPhoto("npm_install.png", "npm install in terminal"), '\r\n' )}`);
__context.__text.push(``);
__context.__text.push(`Node modules are installed`);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.localPhoto("node_modules_created.png", "node modules are installed"), '\r\n' )}`);
__context.__text.push(``);
__context.__text.push(`Now you can close terminal`);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.localPhoto("close_terminal.png", "Close terminal"), '\r\n' )}`);
__context.__text.push(``);
__context.__text.push(`Source files are in projectRoot/story folder (\*.sts)`);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.localPhoto("story_source_files.png", "исходники истории"), '\r\n' )}`);
__context.__text.push(``);
__context.__text.push(`Project preparation is done. This is it's working state`);
__context.__text.push(``);
__context.__text.push(`## Now it's time to build project`);
__context.__text.push(`Open file with story source. For instance, projectRoot/story/index.sts `);
__context.__text.push(``);
__context.__text.push(`Open Command Palette (Menu View -> Command Palette or Ctrl+Shift+P hotkey) `);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.localPhoto("command_palette.png", "command palette"), '\r\n' )}`);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.localPhoto("command_palette_openned.png", "command palette openned"), '\r\n' )}`);
__context.__text.push(``);
__context.__text.push(`Choose command "Compile: Compile and show preview" (Ctrl+Alt+P by default)`);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.localPhoto("compile_and_show_preview.png", "compile and show preview"), '\r\n' )}`);
__context.__text.push(``);
__context.__text.push(`Story compiled to typescript are saved to projectRoot/src. `);
__context.__text.push(`typescript files compiled to javascript are saved to projectRoot/out folder.`);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.localPhoto("compiled_story.png", "compiled story"), '\r\n' )}`);
__context.__text.push(``);
__context.__text.push(`When story build is done, storytailor preview opens`);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.localPhoto("preview_story.png", "Preview story"), '\r\n' )}`);
__context.__text.push(``);
__context.__text.push(`Preview window can be placed as you wish`);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.localPhoto("layout_2.png", "layout variant 2"), '\r\n' )}`);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.localPhoto("layout_3.png", "layout variant 3"), '\r\n' )}`);
__context.__text.push(``);
__context.__text.push(`Text that is shown in preview window is saved to projectRoot/story output.txt file`);
__context.__text.push(``);
__context.__text.push(`${__serializer.serialize( __context.localPhoto("story_output.png", "story output"), '\r\n' )}`);


// INFO: this trick is for making this file node module
Object.assign(module.exports, __context);

//# sourceMappingURL=C:\Projects\storytailor-vscode-extension\readme\out\index.js.map