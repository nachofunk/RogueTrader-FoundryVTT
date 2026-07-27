import CharacterModel from "./character.mjs";

const { StringField, SchemaField } = foundry.data.fields;

export default class ExplorerModel extends CharacterModel {
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "explorer",
        };
    }

    /** @inheritdoc */
    static defineSchema() {
        const schema = super.defineSchema();

        schema.bio.extendFields({
            homeWorld: new StringField({ blank: true, initial: "" }),
            birthright: new StringField({ blank: true, initial: "" }),
            career: new StringField({ blank: true, initial: "" }),
            motivation: new StringField({ blank: true, initial: "" }),
            lure: new StringField({ blank: true, initial: "" }),
            gender: new StringField({ blank: true, initial: "" }),
            age: new StringField({ blank: true, initial: "" }),
            build: new StringField({ blank: true, initial: "" }),
            complexion: new StringField({ blank: true, initial: "" }),
            hair: new StringField({ blank: true, initial: "" }),
            trials: new StringField({ blank: true, initial: "" }),
            nature: new StringField({ blank: true, initial: "" }),
        });

        return schema;
    }

    prepareBaseData() {
        super.prepareBaseData();
    }

    prepareDerivedData() {
        super.prepareDerivedData();
    }
}
