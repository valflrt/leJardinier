import chalk from "chalk";

import LeJardinier from "./bot/bot";
import log from "./bot/log";

log.logger.clear();

log.logger.write(` ${chalk.hex("#abf7a7").bold`Le Jardinier`} 🍀 ${chalk.grey.italic`v2.1`}`);
log.logger.write(chalk.grey`  by valflrt`);
log.logger.newLine(2);

LeJardinier.start();