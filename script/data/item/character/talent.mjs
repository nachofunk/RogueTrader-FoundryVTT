import { requiredInteger } from "../../helpers.mjs";
import CharacterItemModel from "./character-item.mjs";

const { StringField } = foundry.data.fields;

export default class TalentModel extends CharacterItemModel {
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "talent"
        };
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.prerequisites = new StringField({ blank: true, initial: "" });
        schema.aptitudes = new StringField({ blank: true, initial: "" });
        schema.benefit = new StringField({ blank: true, initial: "" });
        schema.tier = requiredInteger();
        schema.cost = requiredInteger();
        return schema;
    }
}