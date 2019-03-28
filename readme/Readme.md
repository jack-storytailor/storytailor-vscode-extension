# storytailor-vscode
extension for vscode that provides support for the storytailor programming language

note that this is an experimental build, so some rules may change

[Storytailor instruction (rus)](https://github.com/freewebtime/storyscriptOrigins/blob/master/Instruction.md)

###This readme file was written on storytailor

# Getting started

The easiest way to start working is to open empty folder inside vscode and copy to that folder example project. To do that

Open empty folder

![Empty folder](https://raw.githubusercontent.com/freewebtime/storytailor-vscode-extension/master/client/lib/images/vscode_empty.png)

Right-click on your project root folder and choose "Initialize example project in a working root" from dropdown menu

![init example project](https://raw.githubusercontent.com/freewebtime/storytailor-vscode-extension/master/client/lib/images/init_example_project.png)

This operation copies example project to your root folder. Keep in mind that this command will override corresponding files if any. 

Confirm copying

![Confirm copying](https://raw.githubusercontent.com/freewebtime/storytailor-vscode-extension/master/client/lib/images/confirm_init_example_project.png)

Test project has been copied to your root folder. Structure of your project should look similar to this:

![example prject created](https://raw.githubusercontent.com/freewebtime/storytailor-vscode-extension/master/client/lib/images/example_project_created.png)

Install node modules. To do that

Open terminal

![open terminal](https://raw.githubusercontent.com/freewebtime/storytailor-vscode-extension/master/client/lib/images/open_terminal.png)

Type command "npm install" or "npm i" into terminal and press "ENTER"

![npm install in terminal](https://raw.githubusercontent.com/freewebtime/storytailor-vscode-extension/master/client/lib/images/npm_install.png)

Node modules are installed

![node modules are installed](https://raw.githubusercontent.com/freewebtime/storytailor-vscode-extension/master/client/lib/images/node_modules_created.png)

Now you can close terminal

![Close terminal](https://raw.githubusercontent.com/freewebtime/storytailor-vscode-extension/master/client/lib/images/close_terminal.png)

Source files are in projectRoot/story folder (*.sts)

![исходники истории](https://raw.githubusercontent.com/freewebtime/storytailor-vscode-extension/master/client/lib/images/story_source_files.png)

Project preparation is done. This is it's working state

## Now it's time to build project
Open file with story source. For instance, projectRoot/story/index.sts 

Open Command Palette (Menu View -> Command Palette or Ctrl+Shift+P hotkey) 

![command palette](https://raw.githubusercontent.com/freewebtime/storytailor-vscode-extension/master/client/lib/images/command_palette.png)

![command palette openned](https://raw.githubusercontent.com/freewebtime/storytailor-vscode-extension/master/client/lib/images/command_palette_openned.png)

Choose command "Compile: Compile and show preview" (Ctrl+Alt+P by default)

![compile and show preview](https://raw.githubusercontent.com/freewebtime/storytailor-vscode-extension/master/client/lib/images/compile_and_show_preview.png)

Story compiled to typescript are saved to projectRoot/src. 
typescript files compiled to javascript are saved to projectRoot/out folder.

![compiled story](https://raw.githubusercontent.com/freewebtime/storytailor-vscode-extension/master/client/lib/images/compiled_story.png)

When story build is done, storytailor preview opens

![Preview story](https://raw.githubusercontent.com/freewebtime/storytailor-vscode-extension/master/client/lib/images/preview_story.png)

Preview window can be placed as you wish

![layout variant 2](https://raw.githubusercontent.com/freewebtime/storytailor-vscode-extension/master/client/lib/images/layout_2.png)

![layout variant 3](https://raw.githubusercontent.com/freewebtime/storytailor-vscode-extension/master/client/lib/images/layout_3.png)

Text that is shown in preview window is saved to projectRoot/story output.txt file

![story output](https://raw.githubusercontent.com/freewebtime/storytailor-vscode-extension/master/client/lib/images/story_output.png)