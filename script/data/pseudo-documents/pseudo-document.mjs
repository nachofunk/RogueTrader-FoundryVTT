const { DocumentIdField, StringField, FilePathField, IntegerSortField, DocumentTypeField } = foundry.data.fields;

/** PSEUDO DOCUMENTS ARE WORK IN PROGRESS, DO NOT USE THEM! */
export default class PseudoDocument extends foundry.abstract.DataModel {

  static get TYPE() {
    return "";
  }

  static get metadata() {
    return {
      documentName: null,   // override in subclass
      embedded: {}          // override in parent model
    };
  }

  static defineSchema() {
    return {
      _id: new DocumentIdField({
        initial: () => foundry.utils.randomID()
      }),
      name: new StringField({ required: true }),
      img: new FilePathField({ categories: ["IMAGE"] }),
      sort: new IntegerSortField(),
    };
  }

  get id() {
    return this._id;
  }

  get documentName() {
    return this.constructor.metadata.documentName;
  }

  /* -------------------------------------------------- */
  /*   Embedded Access                                   */
  /* -------------------------------------------------- */

  getEmbeddedCollection(name) {
    const path = this.constructor.metadata.embedded[name];
    if (!path) throw new Error(`Invalid embedded pseudo-document: ${name}`);
    return foundry.utils.getProperty(this, path);
  }

  getEmbeddedDocument(name, id) {
    return this.getEmbeddedCollection(name).get(id) ?? null;
  }

  /* -------------------------------------------------- */
  /*   Data Preparation                                  */
  /* -------------------------------------------------- */

  prepareBaseData() {
    for (const name of Object.keys(this.constructor.metadata.embedded)) {
      for (const doc of this.getEmbeddedCollection(name)) {
        doc.prepareBaseData();
      }
    }
  }

  prepareDerivedData() {
    for (const name of Object.keys(this.constructor.metadata.embedded)) {
      for (const doc of this.getEmbeddedCollection(name)) {
        doc.prepareDerivedData();
      }
    }
  }

  /* -------------------------------------------------- */
  /*   CRUD                                              */
  /* -------------------------------------------------- */

  get isSource() {
    const fieldPath = this.parent.constructor.metadata.embedded[this.documentName];
    const parent = this.parent instanceof foundry.abstract.TypeDataModel
      ? this.parent.parent
      : this.parent;

    const source = foundry.utils.getProperty(parent._source, fieldPath);
    return source && this.id in source;
  }

  async update(change = {}, operation = {}) {
    if (!this.isSource) throw new Error("Cannot update non-source pseudo-document.");
    const path = `${this.fieldPath}.${this.id}`;
    return this.document.update({ [path]: change }, operation);
  }

  async delete(operation = {}) {
    if (!this.isSource) throw new Error("Cannot delete non-source pseudo-document.");
    const path = `${this.fieldPath}.${this.id}`;
    return this.document.update({ [path]: _del }, operation);
  }

  async duplicate() {
    if (!this.isSource) throw new Error("Cannot duplicate non-source pseudo-document.");
    const data = foundry.utils.mergeObject(this.toObject(), {
      name: `Copy of ${this.name}`
    });
    return this.constructor.create(data, { parent: this.document });
  }

  static async create(data = {}, { parent, ...operation } = {}) {
    if (!parent) throw new Error("Parent required.");

    const id = foundry.utils.randomID();
    const model = parent.system;
    const fieldPath = model.constructor.metadata.embedded[this.metadata.documentName];

    const update = {
      [`${fieldPath}.${id}`]: { ...data, _id: id }
    };

    await parent.update(update, operation);
    return parent.getEmbeddedDocument(this.metadata.documentName, id);
  }

  /* -------------------------------------------------- */
  /*   Helpers                                           */
  /* -------------------------------------------------- */

  get fieldPath() {
    return this.parent.constructor.metadata.embedded[this.documentName];
  }

  get document() {
    let p = this;
    while (!(p instanceof foundry.abstract.Document)) p = p.parent;
    return p;
  }
}
