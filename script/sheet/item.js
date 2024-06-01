import {showAddModifierDialog} from "../common/dialog.js";

export class RogueTraderItemSheet extends ItemSheet {
  activateListeners(html) {
    super.activateListeners(html);
    html.find("input").focusin(ev => this._onFocusIn(ev));
    html.find('.add-modifier').click(event => {
      const button = $(event.currentTarget);
      const modifierType = button.data('type');

      // Call a method to show a form or dialog to input new modifier details
      showAddModifierDialog(this, modifierType);
    });
  }

  async getData(options) {
    let data = super.getData(options);
        // Item HTML enrichment
    data.item.descriptionHTML = await TextEditor.enrichHTML(
      data.item.description,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
      }
    );
    // Component HTML enrichment
    data.data.system.essentialComponentsHTML = await TextEditor.enrichHTML(
      data.data.system.essentialComponents,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
      }
    );
    data.data.system.supplementalComponentsHTML = await TextEditor.enrichHTML(
      data.data.system.supplementalComponents,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
      }
    );
    data.data.system.complicationsHTML = await TextEditor.enrichHTML(
      data.data.system.complications,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
      }
    );
    data.data.system.pastHistoryHTML = await TextEditor.enrichHTML(
      data.data.system.pastHistory,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
      }
    );
    data.data.system.weaponsHTML = await TextEditor.enrichHTML(
      data.data.system.weapons,
      {
        secrets: data.item.isOwner,
        rollData: data.rollData,
        async: true,
        relativeTo: this.item,
      }
    );
    return {
      item: data.item,
      system: data.data.system
    };
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    buttons = [
      {
        label: game.i18n.localize("BUTTON.POST_ITEM"),
        class: "item-post",
        icon: "fas fa-comment",
        onclick: ev => this.item.sendToChat()
      }
    ].concat(buttons);
    return buttons;
  }

  _onFocusIn(event) {
    $(event.currentTarget).select();
  }

  /**
   * Adds a new modifier to the item.
   * @param {string} modifierType - The type of the modifier ('characteristic', 'skill', 'other').
   * @param {string} attributeName - The name of the affected attribute.
   * @param {number} modifierValue - The value of the modifier to add.
   */
  addModifier(modifierType, attributeName, modifierValue) {
    // Ensure the modifier type is valid
    if (!['characteristic', 'skill', 'other'].includes(modifierType)) {
      console.error('Invalid modifier type. Must be "characteristic", "skill", or "other".');
      return;
    }

    // Directly access the item's data
    const itemData = this.object.system;

    // Initialize the modifiers object if it doesn't exist
    if (!itemData.modifiers) {
      itemData.modifiers = { characteristic: {}, skill: {}, other: {} };
    }

    const mod = {
      name: attributeName,
      value: modifierValue
    }

    // Set the new modifier value
    itemData.modifiers[modifierType][attributeName] = mod;

    // Update the item with the new modifier
    this.object.update({ 'system.modifiers': itemData.modifiers }).then(() => {
      console.log(`Modifier added: ${modifierType} - ${attributeName}: ${modifierValue}`);
    }).catch(err => {
      console.error('Error updating item with new modifier:', err);
    });

    console.log(this);
  }
}
