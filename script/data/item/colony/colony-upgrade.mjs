import { requiredInteger } from "../../helpers.mjs";
import { Availability } from "../../enums/_module.mjs";
import ColonyItemModel from "./colony-item.mjs";

const { BooleanField, StringField } = foundry.data.fields;

const Properties = foundry.utils;
export default class ColonyUpgradeModel extends ColonyItemModel {
    /** @inheritdoc */
    static migrateData(source) {
        if (!source) return super.migrateData(source);
        if (source.availability && !Availability.KEYS[source.availability]) {
            Properties.setProperty(source, `availability`, Availability.tryParseLegacyValue(source.availability));
        }
        return super.migrateData(source);
    }

    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "colonyUpgrade"
        };
    }

    /** @inheritdoc */
    static defineSchema() {
        const schema = super.defineSchema();
        schema.yearlyLoyalty = requiredInteger({ min: Number.MIN_SAFE_INTEGER });
        schema.yearlyProsperity = requiredInteger({ min: Number.MIN_SAFE_INTEGER });
        schema.yearlySecurity = requiredInteger({ min: Number.MIN_SAFE_INTEGER });
        schema.usesUpgradeSlot = new BooleanField({ initial: true });
        schema.bonusSlots = requiredInteger({ min: Number.MIN_SAFE_INTEGER });
        schema.special = new StringField({ blank: true, initial: "" });
        schema.prerequisites = new StringField({ blank: true, initial: "" });
        schema.availability = Availability.schema();
        return schema;
    }
}