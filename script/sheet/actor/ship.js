import {prepareCommonRoll, prepareCombatRoll, preparePsychicPowerRoll} from "../../common/dialog.js";
import RogueTraderUtil from "../../common/util.js";
import { RogueTraderSheet } from "./actor.js";

export class ShipSheet extends RogueTraderSheet {
  side = "";

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["rogue-trader", "sheet", "actor"],
      template: "systems/rogue-trader/template/sheet/actor/ship.html",
      width: 700,
      height: 725,
      resizable: true,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "stats"
        }
      ]
    });
  }

  activateListeners(html) {
    super.activateListeners(html);
  }

  async _onDrop(event)
  {
    console.log("BAR");
    console.log(event);
    this.side = event.target.dataset.shipside || "port";
    return await super._onDrop(event);
  }

  async _onDropItemCreate(itemData) 
  {
    console.log(itemData);
    if (itemData.type === "shipWeapon")
    {
      itemData.system.side = this.side;
    }
    let items = await super._onDropItemCreate(itemData);
    this._updateObject(null, this.getData());
    return items;
  }

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    buttons = [].concat(buttons);
    return buttons;
  }
}
