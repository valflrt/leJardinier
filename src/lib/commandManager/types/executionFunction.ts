import MessageInstance from "../../../bot/message";

type TExecutionFunction = (messageInstance: MessageInstance) => Promise<any>;

export default TExecutionFunction;
