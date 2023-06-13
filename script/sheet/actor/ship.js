import {prepareCommonRoll, prepareCombatRoll, preparePsychicPowerRoll} from "../../common/dialog.js";
import RogueTraderUtil from "../../common/util.js";
import { RogueTraderSheet } from "./actor.js";

export class ShipSheet extends RogueTraderSheet {
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

  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    buttons = [].concat(buttons);
    return buttons;
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
}
