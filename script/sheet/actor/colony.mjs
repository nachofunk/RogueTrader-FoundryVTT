import { prepareCommonRoll, prepareConsumeResourcesRoll, prepareGovernorRoll } from "../../common/dialog.js";
import ColonyRollData from "../../common/roll-data/colony-roll-data.mjs";
import { rollColonyEvents, rollColonyGrowth } from "../../common/roll.js";
import RogueTraderUtil from "../../common/util.mjs";
import RogueTraderSheet from "./actor.mjs";

export default class ColonySheet extends RogueTraderSheet {
  static DEFAULT_OPTIONS = {
    classes: ["rogue-trader", "sheet", "actor", "colony"],
    position: {
      width: 760,
      height: 920
    },
    actions: {
      rollGrowth: ColonySheet.#rollGrowth,
      rollEvents: ColonySheet.#rollEvents,
      rollGovernor: ColonySheet.#rollGovernor,
      rollResources: ColonySheet.#rollResources
    }
  };

  static METADATA = {
    types: ["colony"],
    makeDefault: true,
  }


  // v13 MIGRATION: V2 Tab System Definition
  // TABS must have 'tabs' as an ARRAY (not object) with 'initial' property
  static TABS = {
    primary: {
      tabs: [
        {
          id: "colony-core",
          group: "primary",
          label: "TAB.CORE",
          icon: "fa-solid fa-home",
          cssClass: "tab-core"
        },
        {
          id: "colony-upgrades",
          group: "primary",
          label: "TAB.UPGRADES",
          icon: "fa-solid fa-arrow-up",
          cssClass: "flex tab-upgrades"
        },
        {
          id: "colony-notes",
          group: "primary",
          label: "TAB.NOTES",
          icon: "fa-solid fa-note-sticky",
          cssClass: "flex tab-notes"
        }
      ],
      initial: "colony-core"
    }
  };

  static PARTS = {
    sheet: {
      template: "systems/rogue-trader/template/sheet/actor/colony.html",
      classes: ['colony-content', 'actor-sheet'],
      scrollable: [''],
    },
  };

  /**
   * Handle colony growth roll.
   * @this {ColonySheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollGrowth(event, target) {
    const actor = this.document;
    const growthData = this.#updateGrowthPoints(actor);
    await rollColonyGrowth(ColonyRollData.createColonyGrowthRollData(this.document, growthData));
    await this.document.update(this.#growthUpdate(growthData));
  }

  /**
   * Handle colony events roll.
   * @this {ColonySheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollEvents(event, target) {
    event.preventDefault();
    await rollColonyEvents(ColonyRollData.createEventRollData(this.document));
  }

  /**
   * Handle governor skill roll.
   * @this {ColonySheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollGovernor(event, target) {
    event.preventDefault();
    await prepareGovernorRoll(ColonyRollData.createGovernorRollData(this.document));;
  }

  /**
   * Handle resource consumption roll.
   * @this {ColonySheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #rollResources(event, target) {
    event.preventDefault();
    await prepareConsumeResourcesRoll(ColonyRollData.createResourceRollData(this.document), this.document);
  }

  #updateGrowthPoints(actor) {
    const actorStats = foundry.utils.deepClone(actor.system.stats);
    const startLoyalty = actorStats.loyalty;
    const startProsperity = actorStats.prosperity;
    const startSecurity = actorStats.security;
    actorStats.loyalty += actorStats.loyaltyGain;
    actorStats.prosperity += actorStats.prosperityGain;
    actorStats.security += actorStats.securityGain;
    switch (actor.system.governor.governorType) {
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

  #growthUpdate(growthData) {
    return {
      [`system.stats.loyalty`]: growthData.loyalty.updated,
      [`system.stats.prosperity`]: growthData.prosperity.updated,
      [`system.stats.security`]: growthData.security.updated
    }
  }

  async _onDropActor(event, data) {
    const context = await this._prepareContext();
    const droppedActor = game.actors.get(data.uuid.split(".")[1]);
    if (droppedActor) {
      switch (event.target.dataset.crewRole) {
        case "governor":
          {
            context.system.governor.actor = droppedActor.id;
            break;
          }
        default:
          console.log(event.target.dataset.crewRole);
          break;
      }
      await this.document.update(context.system);
    }
  }

  // v13 MIGRATION: appv2 uses _prepareContext() instead of getData()
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    return context;
  }
}
