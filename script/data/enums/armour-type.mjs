import { EnumBase } from "./enum-base.mjs";

export default class ArmourType extends EnumBase {
  static DEFAULT = "basic";

  static DATA = Object.freeze({
    basic: { label: "ARMOUR_TYPE.BASIC" },
    flak: { label: "ARMOUR_TYPE.FLAK" },
    mesh: { label: "ARMOUR_TYPE.MESH" },
    carapace: { label: "ARMOUR_TYPE.CARAPACE" },
    power: { label: "ARMOUR_TYPE.POWER" },
    other: { label: "ARMOUR_TYPE.OTHER" }
  });
}
