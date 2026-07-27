import CharacterItemModel from "./character-item.mjs";

export default class MutationModel extends CharacterItemModel {
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "mutation"
        };
    }

    
}