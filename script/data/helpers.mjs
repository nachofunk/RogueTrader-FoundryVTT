const { NumberField, SchemaField, StringField } = foundry.data.fields;

/**
 * Constructs a number field that is always a number with a min of 0.
 * @param {object} [options] Options to forward to the field.
 * @param {number} [options.initial=0]  The initial value for the field.
 * @param {number} [options.min=0]      The minimum value for the field.
 * @param {number} [options.max]        The maximum value for the field.
 * @param {string} [options.label]      Label for the field.
 * @param {boolean} [options.persisted=true] Is the field saved to the database?
 * @returns A number field that is non-nullable and always defined.
 */
export const requiredInteger = ({ initial = 0, min = 0, max, label, persisted = true } = {}) => new NumberField({ initial, label, min, max, persisted, required: true, nullable: false, integer: true });

export const immutableNumberField = ({initial = 0, label, integer} = {}) => {
    return new NumberField({
        initial: initial,
        min: initial,
        max: initial,
        readonly: true,
        persisted: false,
        required: true, 
        nullable: false, 
        integer: integer
    });
}

export const immutableIntegerField = ({initial = 0, label} = {}) => {
    return new NumberField({
        initial: initial,
        min: initial,
        max: initial,
        readonly: true,
        persisted: false,
        required: true, 
        nullable: false, 
        integer: true
    });
}
