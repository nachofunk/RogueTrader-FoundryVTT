import CharacterSheet from "./character.mjs";

export default class ExplorerSheet extends CharacterSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS static property
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "actor", "explorer"],
    actions: {
      aptitudeCreate: ExplorerSheet.#aptitudeCreate,
      aptitudeDelete: ExplorerSheet.#aptitudeDelete,
      itemCostFocusOut: ExplorerSheet.#itemCostFocusOut
    }
  };

  static METADATA = {
    types: ["explorer"],
    makeDefault: true,
  }

  // v13 MIGRATION: PARTS defines the template structure
  // DocumentSheetV2 automatically renders PARTS and handles form submission
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/actor/explorer.html",
      classes: ['character-content', 'actor-sheet'],
      scrollable: [''],
    }
  };

  /**
   * Handle aptitude creation.
   * @this {ExplorerSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #aptitudeCreate(event, target) {
    event.preventDefault();
    let aptitudeId = Date.now().toString();
    let aptitude = { id: Date.now().toString(), name: "New Aptitude" };
    await this.document.update({[`system.aptitudes.${aptitudeId}`]: aptitude});
    this.render();
  }

  /**
   * Handle aptitude deletion.
   * @this {ExplorerSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #aptitudeDelete(event, target) {
    event.preventDefault();
    const div = target.closest(".item");
    const aptitudeId = div.dataset.aptitudeId.toString();
    await this.document.update({[`system.aptitudes.-=${aptitudeId}`]: null});
    this.render();
  }

  /**
   * Handle item cost focus out.
   * @this {ExplorerSheet}
   * @param {FocusEvent} event
   * @param {HTMLElement} target
   */
  static async #itemCostFocusOut(event, target) {
    event.preventDefault();
    const div = target.closest(".item");
    let item = this.document.items.get(div.dataset.itemId);
    await item.update({"system.cost": target.value});
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    if (this.document.isOwner) {
      buttons = [].concat(buttons);
    }
    return buttons;
  }

  // v13 MIGRATION: appv2 uses _prepareContext() instead of getData()
  // This provides data-specific enrichment for the Explorer sheet
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    return context;
  }
}
