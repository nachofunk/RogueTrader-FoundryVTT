import { EnumBase } from "./enum-base.mjs";

export default class Craftsmanship extends EnumBase {
  static DEFAULT = "common";

  static DATA = Object.freeze({
    poor: { label: "CRAFTSMANSHIP.POOR" },
    common: { label: "CRAFTSMANSHIP.COMMON" },
    good: { label: "CRAFTSMANSHIP.GOOD" },
    best: { label: "CRAFTSMANSHIP.BEST" }
  });
}
