import EquipmentModel from "./equipment.mjs";

const { StringField, BooleanField } = foundry.data.fields;

const Migration = foundry.abstract.Document;
const Properties = foundry.utils;
export default class WeaponModificationModel extends EquipmentModel {
    /** @inheritdoc */
    static migrateData(source) {
        if (!source) return super.migrateData(source);
        if (typeof source.installed !== "boolean") 
            Properties.setProperty(source, `installed`, source.installed === "installed");         
        return super.migrateData(source);
    }
    
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "weaponModification"
        };
    }

    /** @inheritdoc */
    static defineSchema() {
        const schema = super.defineSchema();
        schema.upgrades = new StringField({ blank: true, initial: "" });
        schema.installed = new BooleanField({ initial: false });
        return schema;
    }
}