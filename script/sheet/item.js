export class RogueTraderItemSheet extends ItemSheet {
  activateListeners(html) {
    super.activateListeners(html);
    html.find("input").focusin(ev => this._onFocusIn(ev));
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
}
