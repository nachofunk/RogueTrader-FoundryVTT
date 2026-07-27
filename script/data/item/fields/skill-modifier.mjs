import { Skills } from "../../enums/_module.mjs";
import { requiredInteger } from "../../helpers.mjs";

const { SchemaField } = foundry.data.fields;

export default class SkillModifier {
    static schemaDefinition() { 
        return new SchemaField({
            propertyKey: Skills.schema(),
            rollBonus: requiredInteger({min: Number.MIN_SAFE_INTEGER}),
        });
    }

    static get DEFAULT_OBJECT() {
        return SkillModifier.schemaDefinition().getInitialValue();
    }
}