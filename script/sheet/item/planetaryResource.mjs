import RogueTraderItemSheet from "./item.mjs";

export default class PlanetaryResourceSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "planetary-resource"],
  };

  static METADATA = {
    types: ["planetaryResource"],
    makeDefault: true,
  }

  static {
    const tabs = foundry.utils.deepClone(super.TABS);
    tabs.primary.tabs.unshift({
      id: "colony-resource-data",
      group: "primary",
      label: "TAB.DATA",
      icon: "fa-solid fa-star",
      cssClass: "tab-data"
		});
    tabs.primary.initial = "colony-resource-data";
    this.TABS = tabs;
  }
}