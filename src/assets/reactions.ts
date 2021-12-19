import { randomItem } from "../utils";

class ReactionCollection {
    public readonly emotes: string[];

    constructor(...emotes: string[]) {
        this.emotes = emotes;
    }

    public get random(): string {
        return randomItem(...this.emotes);
    }
}

export default {
    success: new ReactionCollection("✨", "👍", "🎉"),
    error: new ReactionCollection("💥", "⚰️", "❗"),
    smile: new ReactionCollection(":3", ":)", "c:", ":D"),
};
