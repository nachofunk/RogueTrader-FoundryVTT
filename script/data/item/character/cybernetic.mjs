import EquipmentModel from "./equipment.mjs";

const { BooleanField } = foundry.data.fields;

const Migration = foundry.abstract.Document;
const Properties = foundry.utils;
export default class CyberneticModel extends EquipmentModel {
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
            type: "cybernetic"
        };
    }

    /** @inheritdoc */
    static defineSchema() {
        const schema = super.defineSchema();
        schema.installed = new BooleanField({ initial: false })
        return schema;
    }
}