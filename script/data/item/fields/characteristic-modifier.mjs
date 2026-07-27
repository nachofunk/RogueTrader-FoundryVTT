import { Characteristics } from "../../enums/_module.mjs";
import { requiredInteger } from "../../helpers.mjs";

const { SchemaField } = foundry.data.fields;

export default class CharacteristicModifier {
    static schemaDefinition() { 
        return new SchemaField({
            propertyKey: Characteristics.schema(),
            valueBonus: requiredInteger({min: Number.MIN_SAFE_INTEGER}),
            unnaturalBonus: requiredInteger({min: Number.MIN_SAFE_INTEGER}),
        });
    }

    static get DEFAULT_OBJECT() {
        return CharacteristicModifier.schemaDefinition().getInitialValue();
    }
}