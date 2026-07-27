import { ShipFacing, ShipWeaponClass } from "../../enums/_module.mjs";
import { FormulaField } from "../../fields/_module.mjs";
import { requiredInteger } from "../../helpers.mjs";
import VoidshipItemModel from "./voidship-item.mjs";

const { StringField } = foundry.data.fields;

const Migration = foundry.abstract.Document;
const Properties = foundry.utils;
export default class VoidshipWeaponModel extends VoidshipItemModel {
    /** @inheritdoc */
    static migrateData(source) {
        if (!source) return super.migrateData(source);
        if (source.side === "star")
            Properties.setProperty(source, "side", ShipFacing.STARBOARD);
        return super.migrateData(source);
    }
    
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "shipWeapon",
        };
    }

    /** @inheritdoc */
    static defineSchema() {
        const schema = super.defineSchema();
        schema.class = ShipWeaponClass.schema();
        schema.strength = requiredInteger({ initial: 1, min: 1});
        schema.damage = new StringField({ initial: "1d10" });
        schema.critRating = requiredInteger();
        schema.range = requiredInteger();
        schema.side = ShipFacing.schema();
        schema.rof = requiredInteger({ initial: 1, min: 1 })
        return schema;
    }

    /** @inheritdoc */
    prepareBaseData() {
        super.prepareBaseData();
        const weaponClassData = ShipWeaponClass.DATA[this.class];
        this.ignoreArmour = weaponClassData.ignoreArmour;
        this.ignoreShields = false;
    }
}