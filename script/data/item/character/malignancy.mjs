import CharacterItemModel from "./character-item.mjs";

export default class MalignancyModel extends CharacterItemModel {
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "malignancy"
        };
    }

    
}