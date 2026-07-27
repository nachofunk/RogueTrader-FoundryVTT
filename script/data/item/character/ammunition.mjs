import { DamageType } from "../../enums/_module.mjs";
import { FormulaField } from "../../fields/_module.mjs";
import { requiredInteger } from "../../helpers.mjs";
import EquipmentModel from "./equipment.mjs";

const { SchemaField, StringField } = foundry.data.fields;

const Migration = foundry.abstract.Document;
const Properties = foundry.utils;
export default class AmmunitionModel extends EquipmentModel {
    /** @inheritdoc */
    static migrateData(source) {
        if (!source) return super.migrateData(source);
        Migration._addDataFieldMigration(source, `effect.damage`, `damage`);
        Migration._addDataFieldMigration(source, `effect.special`, `special`);
        Migration._addDataFieldMigration(source, `effect.penetration`, `penetration`);
        Migration._addDataFieldMigration(source, `effect.attack.modifier`, `attack`);
        Properties.deleteProperty(source, `effect`);
        let dmgMod = source.damage.modifier;
        if (!(typeof dmgMod === "number")) {
            dmgMod = Number(dmgMod);
            dmgMod = Number.isFinite(dmgMod) ? dmgMod : 0;
            Properties.setProperty(source, `damage.modifier`, dmgMod);
        }
        return super.migrateData(source);
    }

    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "ammunition"
        };
    }

    /** @inheritdoc */
    static defineSchema() {
        const schema = super.defineSchema();
        schema.damage = new SchemaField({
                modifier: requiredInteger(),
                type: DamageType.schema(),
            }); 
        schema.penetration = requiredInteger();
        schema.attack = requiredInteger();
        schema.special = new StringField({ blank: true, initial: "" });
        schema.weapon = new StringField({ blank: true, initial: ""});
        schema.quantity = requiredInteger();
        return schema;
    }
}