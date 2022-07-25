import { show } from "../context.js";
import { buttonWizard } from "./buttonWizard.js";

export async function cascadeMenuWizard({ inquirer, buffer }) {
    let loop = true;
    let buttons = [];
    let index = 1;
    while (loop) {
        let button = await show(buttonWizard, { index, cascade: true, switchToPrimary: false });
        buttons.push(button);
        index++;
        let { more } = await inquirer.prompt({
            type: "confirm",
            name: "more",
            message: "Do you want to add more buttons to this menu?"
        });
        loop = more;
    }
    process.stdin.setRawMode(true);
    buffer.primary();
    return buttons;
}