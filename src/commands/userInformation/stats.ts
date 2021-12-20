import CCommand from "../../managers/commands/classes/command";

const stats = new CCommand()
  .setName("stats")
  .setDescription("Gives user stats")
  .setExecution(async (messageInstance) => {});

export default stats;
