import RogueTraderItemSheet from "./item.mjs";

export default class ShipWeaponSheet extends RogueTraderItemSheet {
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "ship-weapon"],
  };

  static METADATA = {
    types: ["shipWeapon"],
    makeDefault: true,
  }

  static {
    const tabs = foundry.utils.deepClone(super.TABS);
    tabs.primary.tabs.unshift({
      id: "ship-weapon-data",
      group: "primary",
      label: "TAB.DATA",
      icon: "fa-solid fa-chart-bar",
      cssClass: "flex tab-data"
    });
    tabs.primary.initial = "ship-weapon-data";
    this.TABS = tabs;
  }
}
