import { EnumBase } from "./enum-base.mjs";

export default class ShipComponentClass extends EnumBase {
  static DEFAULT = "voidEngine";

  static DATA = Object.freeze({
    voidEngine: { 
      label: "SHIP_ITEM.VOID_ENGINE",
      isEssential: true,
    },
    warpEngine: { 
      label: "SHIP_ITEM.WARP_ENGINE",
      isEssential: true,
    },
    gellarField: { 
      label: "SHIP_ITEM.GELLAR_FIELD",
      isEssential: true, 
    },
    voidShield: { 
      label: "SHIP_ITEM.VOID_SHIELD",
      isEssential: true, 
    },
    bridge: { 
      label: "SHIP_ITEM.BRIDGE",
      isEssential: true, 
    },
    lifeSupport: { 
      label: "SHIP_ITEM.LIFE_SUPPORT",
      isEssential: true, 
    },
    crewQuarters: { 
      label: "SHIP_ITEM.CREW_QUARTERS",
      isEssential: true, 
    },
    augurArray: { 
      label: "SHIP_ITEM.AUGUR_ARRAY",
      isEssential: true, 
    },
    supplemental: { 
      label: "SHIP_ITEM.SUPPLEMENTAL",
      isEssential: false, 
    }
  });
}
