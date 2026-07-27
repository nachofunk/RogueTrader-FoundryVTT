import { Availability, Craftsmanship } from "../../enums/_module.mjs";
import { requiredInteger } from "../../helpers.mjs";
import CharacterItemModel from "./character-item.mjs";
const { NumberField } = foundry.data.fields;

const Migration = foundry.abstract.Document;
const Properties = foundry.utils;

export default class EquipmentModel extends CharacterItemModel {
    /** @inheritdoc */
    static migrateData(source) {
        if (!source) return super.migrateData(source);        
        if (source.availability && !Availability.KEYS[source.availability]) {
            Properties.setProperty(source, `availability`, Availability.tryParseLegacyValue(source.availability));
        }
        return super.migrateData(source);
    }

    /** @inheritdoc */
    static defineSchema() {
        const schema = super.defineSchema();
        schema.craftsmanship = Craftsmanship.schema();
        schema.availability = Availability.schema();
        schema.weight = new NumberField({ initial: 0 });
        return schema;
    }

    /** @inheritdoc */
    prepareBaseData() {
        super.prepareBaseData();
    }

    /* -------------------------------------------------- */

    /** @inheritdoc */
    prepareDerivedData() {
        super.prepareDerivedData();
    }

    /* -------------------------------------------------- */
}