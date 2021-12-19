import DefaultManager from "./default";

import MemberSchema from "../schemas/member";

export default class MemberManager extends DefaultManager<MemberSchema> {
    protected override schemaConstructor = MemberSchema;
}
