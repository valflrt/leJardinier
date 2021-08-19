import MessageInfo from "./message";

export default class ReplyMethods {

	private message: MessageInfo;

	constructor(message: MessageInfo) {
		this.message = message;
	}

	answer = (text: string, files: string[]) => {
		this.message.message.channel.send(`${mention(text)}${text}`, files || {});
	}

	simple = text => {
		this.message.channel.send(text);
	}

	embed = (text, files = []) => {
		return this.message.channel.send(
			this.embed()
				.setDescription(text)
				.attachFiles(files)
		);
	}

	returnEmbed = (text: string, files: string[] = []) => {
		return this.embed()
			.setDescription(text)
			.attachFiles(files)
	}

	customEmbed = (config, files = []) => {
		let embed = this.embed()
			.attachFiles(files);

		let newEmbed = config(embed);

		return this.message.channel.send(newEmbed);
	}

	returnCustomEmbed = (config, files = []) => {
		let embed = this.embed()
			.attachFiles(files);

		let newEmbed = config(embed);

		return newEmbed;
	}

}