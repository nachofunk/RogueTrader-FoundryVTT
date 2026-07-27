import { EnumBase } from "./enum-base.mjs";

export default class ColonyType extends EnumBase {
  static DEFAULT = "research";

  static DATA = Object.freeze({
    research: { 
      label: "COLONY.TYPE.RESEARCH",
      yearlyGainsModifier: {
        prosperity: 0,
        security: 0,
        loyalty: -1,
      } 
    },
    mining: { 
      label: "COLONY.TYPE.MINING",
      yearlyGainsModifier: {
        prosperity: 0,
        security: -1,
        loyalty: 0,
      } 
    },
    ecclesiastical: { 
      label: "COLONY.TYPE.ECCLESIASTICAL",
      yearlyGainsModifier: {
        prosperity: -1,
        security: 0,
        loyalty: 0,
      }
    },
    agricultural: { 
      label: "COLONY.TYPE.AGRICULTURAL",
      yearlyGainsModifier: {
        prosperity: 0,
        security: -1,
        loyalty: 0,
      }
    },
    pleasure: { 
      label: "COLONY.TYPE.PLEASURE",
      yearlyGainsModifier: {
        prosperity: 0,
        security: -1,
        loyalty: 0,
      }
    },
    war: { 
      label: "COLONY.TYPE.WAR",
      yearlyGainsModifier: {
        prosperity: -1,
        security: 0,
        loyalty: 0,
      }
    }
  });
}
