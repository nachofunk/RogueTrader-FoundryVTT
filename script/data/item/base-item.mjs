import RogueTraderSystemModel from "../system-model.mjs";

const { HTMLField } = foundry.data.fields;

export default class BaseItemModel extends RogueTraderSystemModel {
    /** @inheritdoc */
    static defineSchema() {
        const schema = {};
        schema.description = new HTMLField({ blank: true, initial: "" });
        return schema;
    }

    /* -------------------------------------------------- */

    /** @inheritdoc */
    static LOCALIZATION_PREFIXES = ["ROGUE_TRADER.Item.base"];

    /** @inheritdoc */
    prepareBaseData() {
        super.prepareBaseData();
    }

    /* -------------------------------------------------- */

    /** @inheritdoc */
    prepareDerivedData() {
        super.prepareDerivedData();
    }
}
