import { CharacteristicModifier, SkillModifier } from "../fields/_module.mjs";
import { default as BaseItemModel } from "../base-item.mjs";
import { PseudoCollectionField } from "../../fields/_module.mjs";
import { toCamelCase } from "../../../utils/string-utility.mjs";
import { Skills } from "../../enums/_module.mjs";
const { SchemaField, ObjectField, EmbeddedCollectionField, ArrayField } = foundry.data.fields;


const Migration = foundry.abstract.Document;
const Properties = foundry.utils;

export default class CharacterItemModel extends BaseItemModel {
    static migrateData(source) {
        if (!source) return super.migrateData(source); 
        Properties.deleteProperty(source, `characteristic`)
        Properties.deleteProperty(source, `skill`)
        Properties.deleteProperty(source, `other`)
        if (source.modifiers && source.modifiers.characteristic && !Array.isArray(source.modifiers.characteristic)) {
            for (const [key, charMod] of Object.entries(source.modifiers.characteristic)) {
                const propertyPath = `modifiers.characteristic.${key}`;
                Migration._addDataFieldMigration(source, `${propertyPath}.id`, `${propertyPath}.propertyKey`);
                Properties.deleteProperty(source, `${propertyPath}.label`);
                Migration._addDataFieldMigration(source, `${propertyPath}.characteristicModifier`, `${propertyPath}.valueBonus`);
                Migration._addDataFieldMigration(source, `${propertyPath}.unnaturalModifier`, `${propertyPath}.unnaturalBonus`);
            }
            Properties.setProperty(source, `modifiers.characteristic`, Object.values(source.modifiers.characteristic));
        }
        if (source.modifiers && source.modifiers.skill && !Array.isArray(source.modifiers.skill)) {
            for (const [key, skillMod] of Object.entries(source.modifiers.skill)) {
                const propertyPath = `modifiers.skill.${key}`;
                if (skillMod)
                Migration._addDataFieldMigration(source, `${propertyPath}.id`, `${propertyPath}.propertyKey`, 
                    (data) => CharacterItemModel.#parseSkillModifierKey(data.modifiers.skill[key].id));
                Properties.deleteProperty(source, `${propertyPath}.label`);
                Migration._addDataFieldMigration(source, `${propertyPath}.skillModifier`, `${propertyPath}.rollBonus`);
            }
            Properties.setProperty(source, `modifiers.skill`, Object.values(source.modifiers.skill));
        }
        return super.migrateData(source);
    }

    static #parseSkillModifierKey(oldKey) {
        const split = oldKey.split(`:`);
        if (split.length <= 1) return Skills.convertLegacyKey(toCamelCase(oldKey));
        if (split[0].startsWith(`adv`)) return Skills.convertLegacyKey(toCamelCase(split[1]));
        return Skills.convertLegacyKey(toCamelCase(oldKey).replace(`:`, `_`));
    }

    static defineSchema() {
        const schema = super.defineSchema();
        schema.modifiers = new SchemaField({
            characteristic: new ArrayField(CharacteristicModifier.schemaDefinition()),
            skill: new ArrayField(SkillModifier.schemaDefinition()),
            // other: new EmbeddedCollectionField({ initial: []})
        });
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