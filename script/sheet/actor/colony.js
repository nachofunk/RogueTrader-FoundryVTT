import { rollColonyEvents, rollColonyGrowth } from "../../common/roll.js";
import RogueTraderUtil from "../../common/util.js";
import { RogueTraderSheet } from "./actor.js";

export class ColonySheet extends RogueTraderSheet {

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["rogue-trader", "sheet", "actor"],
      template: "systems/rogue-trader/template/sheet/actor/colony.html",
      width: 750,
      height: 881,
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
    html.find(".roll-growth").click(ev => this._onRollColonyGrowth(ev));
    html.find(".roll-events").click(ev => this._onRollColonyEvents(ev));
  }

  /** @override */
  async getData(options) {
    const data = await super.getData(options);
    return data;
  }

  async _onRollColonyGrowth(ev) {
    ev.preventDefault();
    const actorData = await this.getData();
    const growthData = this._updateGrowthPoints(actorData);
    await rollColonyGrowth(RogueTraderUtil.prepareColonyRollData(this.actor, growthData));
    this._updateObject(ev, actorData);
  }

  _updateGrowthPoints(actorData) {
    const actorStats = actorData.system.stats;
    const startLoyalty = actorStats.loyalty;
    const startProsperity = actorStats.prosperity;
    const startSecurity = actorStats.security;
    actorStats.loyalty += actorStats.loyaltyGain;
    actorStats.prosperity += actorStats.prosperityGain;
    actorStats.security += actorStats.securityGain;
    switch (actorData.system.governor.governorType) {
      case "accounting":
        actorStats.prosperity = Math.max(actorStats.prosperity, 0);
        break;
      case "local":
        actorStats.loyalty = Math.max(actorStats.loyalty, 0);
        break;
      case "warlike":
        actorStats.security = Math.max(actorStats.security, 0);
        break;
    }
    return {
      loyalty: {
        start: startLoyalty,
        updated: actorStats.loyalty,
        difference: actorStats.loyalty - startLoyalty
      },
      prosperity: {
        start: startProsperity,
        updated: actorStats.prosperity,
        difference: actorStats.prosperity - startProsperity
      },
      security: {
        start: startSecurity,
        updated: actorStats.security,
        difference: actorStats.security - startSecurity
      }
    }
  }

  async _onRollColonyEvents(ev) {
    ev.preventDefault();
    await rollColonyEvents(RogueTraderUtil.prepareColonyRollData(this.actor));
  }

  async _rollTableWithID(tableID) {
    let colonyTable = game.tables.get(tableID);
    if (colonyTable) {
      await colonyTable.draw(); // Perform the roll
    } else {
      console.error(`Table with ID ${tableID} not found.`);
    }
  }

  async _onDropActor(event, data) {
    const actorData = await this.getData();
    const droppedActor = game.actors.get(data.uuid.split(".")[1]);
    if (droppedActor)
    {
      switch (event.target.dataset.crewrole) {
        case "governor":
          {
            actorData.system.governor.actor = droppedActor.id;
            break;
          }
        default:
          console.log(event.target.dataset.crewRole);
          break;
      }
      this._updateObject(event, actorData);
    }
  }
}
