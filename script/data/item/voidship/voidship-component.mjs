import { ShipComponentClass } from "../../enums/_module.mjs";
import VoidshipItemModel from "./voidship-item.mjs";

const Migration = foundry.abstract.Document;
const Properties = foundry.utils;
export default class VoidshipComponentModel extends VoidshipItemModel {
    /** @inheritdoc */
    static migrateData(source) {
        if (!source) return super.migrateData(source);
        if (source.class.trim() === "augurArrays")
            Properties.setProperty(source, `class`, ShipComponentClass.KEYS.augurArray);
        return super.migrateData(source);
    }
    
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "shipComponent"
        };
    }

    /** @inheritdoc */
    static defineSchema() {
        const schema = super.defineSchema();
        schema.class = ShipComponentClass.schema();
        return schema;
    }
}