import CharacterItemModel from "./character-item.mjs";

export default class AptitudeModel extends CharacterItemModel {
    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "aptitude"
        };
    }


}