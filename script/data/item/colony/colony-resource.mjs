import { requiredInteger } from "../../helpers.mjs";
import ColonyItemModel from "./colony-item.mjs";

const { StringField, BooleanField } = foundry.data.fields;

export default class PlanetaryResourceModel extends ColonyItemModel {
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "planetaryResource"
        };
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.source = new StringField({ blank: true, initial: "Local" });
        schema.isOrganic = new BooleanField();
        schema.amount = requiredInteger();
        return schema;
    }
}