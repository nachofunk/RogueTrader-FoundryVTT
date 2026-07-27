import { EnumBase } from "./enum-base.mjs";

export default class ShipFacing extends EnumBase {
    static DEFAULT = "prow";

    static DATA = Object.freeze({
        dorsal: { label: "SHIP.SIDE.DORSAL" },
        prow: { label: "SHIP.SIDE.PROW" },
        keel: { label: "SHIP.SIDE.KEEL" },
        port: { label: "SHIP.SIDE.PORT" },
        starboard: { label: "SHIP.SIDE.STARBOARD" },
    });
}