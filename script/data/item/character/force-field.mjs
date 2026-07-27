import { requiredInteger } from "../../helpers.mjs";
import EquipmentModel from "./equipment.mjs";

export default class ForceFieldModel extends EquipmentModel {
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "forceField"
        };
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.protectionRating = requiredInteger();
        schema.overloadChance = requiredInteger();
        return schema;
    }
}