import chalk from "chalk";

export default function box(text) {
    let settings = {
        paddingtop: 0,
        paddingbottom: 0,
        paddingleft: 1,
        minWidth: 30
    };
    let width = settings.minWidth;
    if (text.length > width) {
        width = text.length + 2;
    }
    let buffer = "";
    buffer += "+" + "-".repeat(width) + "+\n";
    buffer += "| " + chalk.cyan.bold(text) + " ".repeat(width - text.length - 1) + "|\n";
    buffer += "+" + "-".repeat(width) + "+\n";
    console.log(buffer);
}