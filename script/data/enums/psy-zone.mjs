import { EnumBase } from "./enum-base.mjs";

export default class PsyZone extends EnumBase {
  static DEFAULT = "bolt";

  static DATA = Object.freeze({
    none: { label: "ATTACK_TYPE.NONE"},
    bolt: { label: "PSYCHIC_POWER.BOLT" },
    barrage: { label: "PSYCHIC_POWER.BARRAGE" },
    storm: { label: "PSYCHIC_POWER.STORM" },
    blast: { label: "PSYCHIC_POWER.BLAST" }
  });
}