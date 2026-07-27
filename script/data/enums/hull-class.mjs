import { EnumBase } from "./enum-base.mjs";

export default class HullClass extends EnumBase {
  static DEFAULT = "transport";

  static DATA = Object.freeze({
    transport: { label: "HULL_CLASS.TRANSPORT" },
    raider: { label: "HULL_CLASS.RAIDER" },
    frigate: { label: "HULL_CLASS.FRIGATE" },
    lightCruiser: { label: "HULL_CLASS.LIGHT_CRUISER" },
    cruiser: { label: "HULL_CLASS.CRUISER" },
    battlecruiser: { label: "HULL_CLASS.BATTLECRUISER" },
    grandCruiser: { label: "HULL_CLASS.GRAND_CRUISER" },
    battleship: { label: "HULL_CLASS.BATTLESHIP" }
  });
}
