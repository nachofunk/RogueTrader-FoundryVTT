import { EnumBase } from "./enum-base.mjs";

export default class HitLocations extends EnumBase {
    static DEFAULT = "body"

    static DATA = Object.freeze({
        head: { label: "ARMOUR.HEAD" },
        leftArm: { label: "ARMOUR.LEFT_ARM" },
        rightArm: { label: "ARMOUR.RIGHT_ARM" },
        body: { label: "ARMOUR.BODY" },
        leftLeg: { label: "ARMOUR.LEFT_LEG" },
        rightLeg: { label: "ARMOUR.RIGHT_LEG" }
    });
}