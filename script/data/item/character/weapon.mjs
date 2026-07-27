import EquipmentModel from "./equipment.mjs";
import { WeaponClass, WeaponType, DamageType } from "../../enums/_module.mjs";
import { requiredInteger } from "../../helpers.mjs";
import { FormulaField } from "../../fields/_module.mjs";

const { StringField, SchemaField } = foundry.data.fields;

const Migration = foundry.abstract.Document;
const Properties = foundry.utils;
export default class WeaponModel extends EquipmentModel {
    /** @inheritdoc */
    static migrateData(source) {
        if (!source) return super.migrateData(source);
        // Dirty but if damage is string then pen and damageType should exist too
        if (source.damage && typeof source.damage === "string") {
            const damageValue = source.damage;
            const penetration = source.penetration;
            const damageType = source.damageType || DamageType.DEFAULT;
            Properties.deleteProperty(source, `damage`);
            Properties.deleteProperty(source, `damageType`);
            Properties.deleteProperty(source, `penetration`);
            Properties.setProperty(source, `damage`, {
                formula: damageValue,
                type: damageType,
                penetration: penetration
            });
        } 
        return super.migrateData(source);
    }

    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "weapon"
        };
    }

    /** @inheritdoc */
    static defineSchema() {
        const schema = super.defineSchema();
        schema.class = WeaponClass.schema();
        schema.type = WeaponType.schema();
        schema.range = requiredInteger();
        schema.rateOfFire = new SchemaField({
            single: requiredInteger(),
            burst: requiredInteger(),
            full: requiredInteger(),
        });
        schema.damage = new SchemaField({
            formula: new StringField({ blank: false, initial: "1d10" }),
            type: DamageType.schema(),
            penetration: new StringField({ blank: false, initial: "0" }),
        });
        schema.clip = new SchemaField({
            max: requiredInteger({ initial: 0 }),
            value: requiredInteger({ initial: 0 }),
        });
        schema.reload = new StringField({ blank: true, initial: "" });
        schema.special = new StringField({ blank: true, initial: "" });
        schema.attack = requiredInteger({ initial: 0 });
        return schema;
    }

    prepareDerivedData() {
        super.prepareDerivedData();
        this.characteristic = WeaponClass.DATA[this.class].characteristic;
    }
}