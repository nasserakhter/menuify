# Main Menu

*__**Copyright Microart inc. All rights reserved.**__*

The main menu contains all the main functions that menuify can do.

> Creating a project

Creating a project will launch the project creation wizard.
This will allow you to enter a project name, which will be show shown on the windows right click menu.
Next you will enter a project description, to be used to identify the project within Menuify (not used in windows, optional).
After you will enter a target extension, which the context menu will appear on.

```
You can use the extension ALL (all caps) in order to show the context menu on every file type.
```

Next you will enter an icon, which will show up in the windows right click menu.
This can be selected using the built in icon picker.

> Setting up buttons

Setting up the buttons is very straight forward.
If you chose to create a cascading project, you will need to give each button a name.
Otherwise, the project name will become the button name.

If you are cascading, menuify will take you to the cascade creation wizard.
Here you will enter the button name, and choose its action.

You have four possible actions.
1) Run a program
2) Execute a command (cmd)
3) Open a file (with default editor)
4) Configure a ffmpeg command

For the first three, you will need to simply enter the path or command.
However, for setting up a ffmpeg command, you will be taken to the ffmpeg wizard.

> FFmpeg Wizard

This wizard makes it extremely easy to create ffmpeg commands.
The wizard has three preset modes, video to different video extension, video to audio, and video to highly compressed video.
Using these presets you can configure all the knobs and dials.
From changing the compression ratio to changing the video bitrate, you can configure it all.
Once done, the wizard will present a final preview of the command.
You may edit this command and add more or remove some features.

Finally, this command will be added to the button.

Once added the menu should automatically compile and show up in the windows right click menu.

> Editing a menu

Simply chose the edit button menu option and follow the previous steps.

> Deleteing a menu

Again, you simply chose the delete button then from a list select the project to delete.
Menuify will require to you confirm the deletion.

> Importing

You can import custom menu's made by someone else or simply backed up menu by chosing the .menu file in the microart file picker.
Once selected, Menuify will import the menu, compile it, and it will be instantly available in windows.

> Exporting

You can export your custom menu's to a .menu file.
Menuify will prompt you to select a folder to save the file to.
Ideally this would be the downloads folder, however you may save it anywhere.
Warning, since Menuify has administrator privileges, you will be able to save it to the system folder, however this is not advised under any circumstance.

# Online

Microart menuify also provides an online sharing service. This can be used to upload and download other community member's menu files.
The online service is for now in beta, but will be transitioning to a more stable service soon, (In Sha Allah).

Uploading your menu file is very simple, just use the discord server to find the google forms application.
Once you have found the application, you can upload your menu file.

A menuify staff member will then review your file and will either approve or reject it.

> Footnotes

Menuify is in beta, please be patient with the development.
Menuify is also a gui cli application, it runs on the saffron cli framework made by Microart.
The basic windows command prompt is more than enough to run menuify, however, you many need to resize the window to make it fit your screen.
Lastly, enjoy using Menuify.