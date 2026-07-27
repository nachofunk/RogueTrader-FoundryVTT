import ColonyItemModel from "./colony-item.mjs";

const { StringField, HTMLField } = foundry.data.fields;

export default class ColonyEventModel extends ColonyItemModel {
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "colonyEvent"
        };
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.themes = new StringField({ blank: true, initial: "" });
        schema.effect = new HTMLField();
        return schema;
    }
}