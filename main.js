import { startApp } from "./src/app.js";
import { defaults, config, presets } from './src/storageProvider.js';
import { constants } from './src/constants.js';
import chalk from 'chalk';

console.log(chalk.cyan(constants.splash));
console.log("");
console.log(chalk.cyan(`${constants.name} v${constants.version.toFixed(1)} by ${constants.developer}`));
console.log(chalk.cyan(`For more information, guides, or anything else visit: \n${chalk.yellow.underline(constants.url)}`));
console.log(chalk.cyan(`(C)${(new Date()).getFullYear()} Microart inc. All Rights Reserved\n`));

await startApp();