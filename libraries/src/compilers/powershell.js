export function compilePowershell(action) {
    let script = [];
    // Setup and Styling
    script.push("$size = new-object system.management.automation.host.size(90,7)");
    script.push("$host.ui.rawui.windowSize = $size");
    script.push("$host.ui.rawui.bufferSize = $size");
    script.push("$host.ui.rawui.windowTitle = 'Menuify - Running command'");
    script.push("$host.ui.rawui.backgroundColor = 'yellow'");
    script.push("$host.ui.rawui.foregroundColor = 'black'");

    // Clear screen
    script.push(`$blanks = ""`);
    script.push(`1..$($size.height) | %{ $blanks += (" " * $size.width) }`);
    script.push("write-host $blanks -nonewline");
    script.push("[console]::setCursorPosition(0,0)");


    script.push(`write-host "Running command '${action.info}', please wait..."`);
    script.push(`$file = get-item $($args[0])`);

    // Run command
    script.push(action.command.replaceAll("{filename}", "$($file.name)").replaceAll("{filenameWE}", "$($file.basename)"));

    return script.join("\n");
}