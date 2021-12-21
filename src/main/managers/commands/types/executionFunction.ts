import MessageInstance from "../../../bot/message";

type TExecutionFunction = (
  messageInstance: MessageInstance
) => Promise<any> | void;

export default TExecutionFunction;
