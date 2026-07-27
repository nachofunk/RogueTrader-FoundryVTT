import CharacterItemModel from "./character-item.mjs";

const { StringField } = foundry.data.fields;

export default class TraitModel extends CharacterItemModel {
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "trait"
        };
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.benefit = new StringField({ blank: true, initial: "" });
        return schema;
    }
}