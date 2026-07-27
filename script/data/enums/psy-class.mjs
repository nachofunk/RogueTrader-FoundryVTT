import { EnumBase } from "./enum-base.mjs";

export default class PsyClass extends EnumBase {
    static DEFAULT = "bound";

    static DATA = Object.freeze({
        bound: { 
            label: "PSYCHIC_POWER.BOUND",
            maxPushPR: 3, 
        },
        unbound: { 
            label: "PSYCHIC_POWER.UNBOUND",
            maxPushPR: 3, 
        },
        daemonic: { 
            label: "PSYCHIC_POWER.DAEMONIC",
            maxPushPR: 3, 
        }
    });
}