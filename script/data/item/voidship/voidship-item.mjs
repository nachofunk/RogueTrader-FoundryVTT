import BaseItemModel from "../base-item.mjs";
import { Availability, Craftsmanship } from "../../enums/_module.mjs"
import { requiredInteger } from "../../helpers.mjs";

const { StringField } = foundry.data.fields;

const Properties = foundry.utils;
export default class VoidshipItemModel extends BaseItemModel {
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
        schema.weight = requiredInteger();
        schema.hullTypes = new StringField();
        schema.power = requiredInteger();
        schema.space = requiredInteger();
        schema.shipPoints = requiredInteger();
        return schema;
    }
}