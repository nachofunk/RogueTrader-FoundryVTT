import { Characteristics } from "../../enums/_module.mjs";
import { requiredInteger } from "../../helpers.mjs";
import BaseModifier from "./base-modifier.mjs";

/** PSEUDO DOCUMENTS ARE WORK IN PROGRESS, DO NOT USE THEM! */
export default class CharacteristicModifier extends BaseModifier {

    static get TYPE() {
        return "CharacteristicModifier";
    }

    static get metadata() {
        const metadata = super.metadata;
        metadata.documentName = "characteristicModifier";
        return metadata;
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.characteristic = Characteristics.schema();
        schema.characteristicBonus = requiredInteger();
        schema.unnaturalBonus = requiredInteger();
        return schema;
    }

    /** @inheritdoc */
    prepareBaseData() {
        super.prepareBaseData();
        this.label = game.i18n.localize(Characteristics.DATA[this.characteristic].label);
    }
}