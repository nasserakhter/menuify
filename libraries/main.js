import { startApp } from "./src/app.js";
import { defaults, config, presets } from './src/storageProvider.js';
import { constants } from './src/constants.js';
import chalk from 'chalk';

console.clear();
process.stdout.write("\x1B]0;Menuify\x07");
console.log(chalk.cyan(constants.splash));
console.log("");
console.log(chalk.cyan(`${constants.name} v${constants.version} by ${constants.developer}`));
console.log(chalk.cyan(`For more information, guides, or anything else visit: \n${chalk.yellow.underline(constants.url)} `));
console.log(chalk.cyan(`(C)${(new Date()).getFullYear()} Microart inc. All Rights Reserved\n`));

try {
    await startApp();
} catch (err) {
    console.error(chalk.red(err.message));
    console.log(chalk.magenta(`You can report this error here: ${chalk.underline("https://microart.cf/menuify/report?code=" + err.code)}`));
    console.warn(chalk.yellow(`${constants.name} will now exit.`));
    console.log(err);
}