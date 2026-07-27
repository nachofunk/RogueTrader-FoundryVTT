import RogueTraderItemSheet from "./item.mjs";

export default class ShipComponentSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "ship-component"],
  };

  static METADATA = {
    types: ["shipComponent"],
    makeDefault: true,
  }

  static {
    const tabs = foundry.utils.deepClone(super.TABS);
    tabs.primary.tabs.unshift({
      id: "ship-component-data",
      group: "primary",
      label: "TAB.DATA",
      icon: "fa-solid fa-chart-bar",
      cssClass: "flex tab-data"
    });
    tabs.primary.initial = "ship-component-data";
    this.TABS = tabs;
  }
}
