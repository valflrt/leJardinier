import Context from "../../../bot/context";

type TExecutionFunction = (context: Context) => Promise<any> | void;

export default TExecutionFunction;
