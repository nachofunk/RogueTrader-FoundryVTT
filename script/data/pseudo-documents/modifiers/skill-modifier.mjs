import { Skills } from "../../enums/_module.mjs";
import { requiredInteger } from "../../helpers.mjs";
import BaseModifier from "./base-modifier.mjs";

/** PSEUDO DOCUMENTS ARE WORK IN PROGRESS, DO NOT USE THEM! */
export default class SkillModifier extends BaseModifier {

    static get TYPE() {
        return "SkillModifier"
    }

    static get metadata() {
        const metadata = super.metadata;
        metadata.documentName = "skillModifier";
        return metadata;
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.skill = Skills.schema();
        schema.value = requiredInteger();
        return schema;
    }
}