import { EnumBase } from "./enum-base.mjs";

export default class Availability extends EnumBase {
  static DEFAULT = "common";

  static DATA = Object.freeze({
    ubiquitous: { label: "AVAILABILITY.UBIQUITOUS" },
    abundant: { label: "AVAILABILITY.ABUNDANT" },
    plentiful: { label: "AVAILABILITY.PLENTIFUL" },
    common: { label: "AVAILABILITY.COMMON" },
    average: { label: "AVAILABILITY.AVERAGE" },
    scarce: { label: "AVAILABILITY.SCARCE" },
    rare: { label: "AVAILABILITY.RARE" },
    veryRare: { label: "AVAILABILITY.VERY_RARE" },
    extremelyRare: { label: "AVAILABILITY.EXTREMELY_RARE" },
    nearUnique: { label: "AVAILABILITY.NEAR_UNIQUE" },
    unique: { label: "AVAILABILITY.UNIQUE" }
  });

  static tryParseLegacyValue(value) {
    if (!value || typeof value !== "string") return this.DEFAULT;
    // Normalize: lowercase, trim, remove spaces
    let v = value.trim().toLowerCase().replace(/\s+/g, "");
    // Remove hyphens for easier matching
    const noHyphen = v.replace(/-/g, "");
    // Direct match (simple cases)
    if (noHyphen in this.DATA) return noHyphen;
    // Regex-based camelCase converter for hyphenated legacy keys
    // "very-rare" → "veryRare"
    const camel = v.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (camel in this.DATA) return camel;
    // Regex fallback for known patterns
    if (/^very[-]?rare$/.test(v)) return "veryRare";
    if (/^extremely[-]?rare$/.test(v)) return "extremelyRare";
    if (/^near[-]?unique$/.test(v)) return "nearUnique";
    if (/^unique$/.test(v)) return "unique";
    return this.DEFAULT;
  }

}
