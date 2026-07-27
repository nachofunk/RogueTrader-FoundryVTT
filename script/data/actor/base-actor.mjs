import { ValidateSchemaVersion } from "../../../utils/migration.mjs";
import RogueTraderSystemModel from "../system-model.mjs";

const { SchemaField, HTMLField } = foundry.data.fields;
const Properties = foundry.utils;
export default class BaseActorModel extends RogueTraderSystemModel {
    /** @inheritdoc */
    static migrateData(source) {
        if (source.aptitudes) Properties.deleteProperty(source, `aptitudes`);
        if (source.notesHTML) Properties.deleteProperty(source, `notesHTML`);
        return super.migrateData(source);
    }

    /** @inheritdoc */
    static defineSchema() {
        const schema = {};
        schema.bio = new SchemaField({
            notes: new HTMLField(),
        });
        return schema;
    }

    /* -------------------------------------------------- */

    /** @inheritdoc */
    static LOCALIZATION_PREFIXES = ["ROGUE_TRADER.Actor.base"];

    /** @inheritdoc */
	prepareBaseData() {
		super.prepareBaseData();
	}

	/* -------------------------------------------------- */

	/** @inheritdoc */
	prepareDerivedData() {
		super.prepareDerivedData();
	}
}