import RogueTraderItemSheet from "./item.mjs";

export default class ColonyEventSheet extends RogueTraderItemSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "colony-event"],
    position: {
			width: 540,
			height: 460
		},
  };

  static METADATA = {
    types: ["colonyEvent"],
    makeDefault: true,
  }

  static TABS = {
    primary: {
      tabs: [
				{
					id: "colony-event-data",
					group: "primary",
					label: "TAB.DATA",
					icon: "fa-solid fa-shield",
					cssClass: "flex tab-data"
				},
        {
					id: "colony-event-effect",
					group: "primary",
					label: "TAB.EFFECT",
					icon: "fa-solid fa-shield",
					cssClass: "flex tab-effect"
				},
      ],
      initial: `colony-event-data`
    }
  }

  /** @inheritdoc */
	async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.tabs = this._prepareTabs("primary");
		context.effectHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
			this.document.effect,
			{
				secrets: this.document.isOwner,
				rollData: context.rollData,
				async: true,
				relativeTo: this.document,
			}
		);    
    return context;
  }
}
