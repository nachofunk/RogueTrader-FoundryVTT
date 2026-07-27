import { ValidateSchemaVersion } from "../../../utils/migration.mjs";
import NPCType from "../enums/npc-type.mjs";
import { requiredInteger } from "../helpers.mjs";
import CharacterModel from "./character.mjs";

const { StringField, NumberField } = foundry.data.fields;
const Migration = foundry.abstract.Document;
export default class NPCModel extends CharacterModel {
    /** @inheritdoc */
    static migrateData(source) {
        if (!source) return super.migrateData(source);
        
        if (source.type && source.type !== "npc") {
            Migration._addDataFieldMigration(source, `type`, `npcType`);
        }
        return super.migrateData(source);
    }

    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "npc",
        };
    }

    /** @inheritdoc */
    static defineSchema() {
        const schema = super.defineSchema();
        schema.faction = new StringField({ blank: true, initial: "" });
        schema.subfaction = new StringField({ blank: true, initial: "" });
        schema.npcType = NPCType.schema();
        schema.threatLevel = requiredInteger();
        return schema;
    }

    prepareBaseData() {
        super.prepareBaseData();
    }

    prepareDerivedData() {
        super.prepareDerivedData();
    }
}
