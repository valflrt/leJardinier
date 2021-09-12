import chalk from "chalk";

import LeJardinier from "./bot/bot";
import database from "./bot/database";
import log from "./bot/log";

log.logger.clear();

log.logger.write(` ${chalk.hex("#abf7a7").bold`Le Jardinier`} 🍀 ${chalk.grey.italic`v2.1`}`);
log.logger.write(chalk.grey`  by valflrt`);

async () => {

	try {

		await database.connect();

	} finally {
		log.logger.newLine(2);

		LeJardinier.start();
	}

}