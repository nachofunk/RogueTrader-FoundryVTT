import CharacterSheet from "./character.mjs";

export default class NpcSheet extends CharacterSheet {
  // v13 MIGRATION: appv2 uses DEFAULT_OPTIONS with configuration
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "actor", "npc"],
    actions: {
      itemCostFocusOut: NpcSheet.#itemCostFocusOut
    }
  };

  static METADATA = {
    types: ["npc"],
    makeDefault: true,
  }

  // v13 MIGRATION: PARTS defines the template structure
  // DocumentSheetV2 automatically handles form submission with name="system.*" fields
  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/actor/npc.html",
      classes: ['character-content', 'actor-sheet'],
      scrollable: [''],
    }
  };

  /**
   * Handle item cost focus out.
   * @this {NpcSheet}
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

  _prepareTabs(key) {
    const tabs = super._prepareTabs(key);
    for (const [key, tab] of Object.entries(tabs)) {
      if (tab.id === 'stats') {
        tab.partial = 'systems/rogue-trader/template/sheet/actor/tab/npc-stats.html';
      } else if (tab.id === 'notes') {
        tab.partial = 'systems/rogue-trader/template/sheet/actor/tab/npc-notes.html';
      }
    }
    return tabs;
  }

  // v13 MIGRATION: appv2 uses _prepareContext() instead of getData()
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    
    // Enrich biography field
    if (context.system?.bio?.notes) {
      context.system.bio.biographyHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
        context.system.bio.notes,
        {
          secrets: context.document.isOwner,
          rollData: context.rollData,
          async: true,
          relativeTo: context.document,
        }
      );
    }

    return context;
  }


}
