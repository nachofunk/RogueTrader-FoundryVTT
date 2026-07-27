import { EnumBase } from "./enum-base.mjs";

export default class NPCType extends EnumBase {
  static DEFAULT = "troop";

  static DATA = Object.freeze({
    troop: { label: "NPC_TYPE.TROOP" },
    master: { label: "NPC_TYPE.MASTER" },
    elite: { label: "NPC_TYPE.ELITE" }
  });
}
