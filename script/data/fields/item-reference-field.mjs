// script/data/fields/actor-reference-field.mjs
const { StringField } = foundry.data.fields;

export default class ItemReferenceField extends StringField {
  constructor(options = {}) {
    super({
      blank: true,      // allow empty crew slots
      nullable: false,  // must be a string or blank
      ...options
    });
  }

  /** @override */
  validate(value) {
    // Allow blank values
    if (!value) return true;

    // Must be a valid UUID string
    if (!foundry.utils.isValidDocumentUUID(value)) {
      throw new Error(`Invalid Item UUID: ${value}`);
    }

    if (!value.startsWith("Item.") && !value.includes(".Item."))
        throw new Error("UUID does not reference an Actor");

    return true;
  }
}