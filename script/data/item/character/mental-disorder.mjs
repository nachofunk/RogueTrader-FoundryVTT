import CharacterItemModel from "./character-item.mjs";

export default class MentalDisorderModel extends CharacterItemModel {
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "mentalDisorder"
        };
    }

    
}