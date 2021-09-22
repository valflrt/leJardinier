import { randomItem } from "../utils"

class EmoteCollection {

	public readonly emotes: string[];

	constructor(...emotes: string[]) {
		this.emotes = emotes;
	}

	public random = () => randomItem(...this.emotes);
}

export default {
	success: new EmoteCollection(
		"✨",
		"👍",
		"🎉"
	),
	error: new EmoteCollection(
		"💥",
		"⚰️",
		"❗"
	)
};