import { ColonyType, GovernorType } from "../enums/_module.mjs";
import { RogueTraderActor } from "../../documents/actor.mjs";
import { requiredInteger } from "../helpers.mjs";
import BaseActorModel from "./base-actor.mjs";
import { PlanetaryResourceModel, ColonyUpgradeModel } from "../item/colony/_module.mjs";

const { SchemaField, BooleanField, StringField, ForeignDocumentField } = foundry.data.fields;

const Migration = foundry.abstract.Document;
const Properties = foundry.utils;
export default class ColonyModel extends BaseActorModel {
    /** @inheritdoc */
    static migrateData(source) {
        if (!source) return super.migrateData(source);
        
        if (source.resources) Properties.deleteProperty(source, `resources`);
        if (source.upgrades) Properties.deleteProperty(source, `upgrades`);
        return super.migrateData(source);
    }

    /** @inheritdoc */
    static get metadata() {
        return {
            ...super.metadata,
            type: "colony",
        };
    }

    /** @inheritdoc */
    static defineSchema() {
        const schema = super.defineSchema(); 
        schema.governor = new SchemaField({
            actor: new ForeignDocumentField(RogueTraderActor),
            governorType: GovernorType.schema(),
            skillBonus: requiredInteger(),
            advancedTraining: new BooleanField(),
        });
        schema.colonyType = ColonyType.schema();
        schema.stats = new SchemaField({
            size: requiredInteger({ initial: 1 }),
            loyalty: requiredInteger({ min: Number.MIN_SAFE_INTEGER }),
            prosperity: requiredInteger({ min: Number.MIN_SAFE_INTEGER }),
            security: requiredInteger({ min: Number.MIN_SAFE_INTEGER }),
            // TODO: Remove PF, gains and requiredGrowth, they are computed
            profitFactor: requiredInteger(),
            loyaltyGain: requiredInteger({ min: Number.MIN_SAFE_INTEGER }),
            prosperityGain: requiredInteger({ min: Number.MIN_SAFE_INTEGER }),
            securityGain: requiredInteger({ min: Number.MIN_SAFE_INTEGER }),
            requiredGrowth: requiredInteger(),
            conservativeLastTick: new BooleanField(),
        });
        schema.bio.extendFields({
            starSystem: new StringField({ blank: true, initial: "" }),
            planet: new StringField({ blank: true, initial: "" }),
            foundingDate: new StringField({ blank: true, initial: "" }),
            foundingCost: requiredInteger(),
        });
        schema.development = new SchemaField({
            baseSlots: requiredInteger(),
            // TODO: Remove total & occupied, this is computed
            slotsTotal: requiredInteger(),
            occupiedSlots: requiredInteger(),
            acquisitionModifier: requiredInteger({ min: Number.MIN_SAFE_INTEGER }),
        });
        return schema;
    }

    /** @inheritdoc */
    prepareBaseData() {
        super.prepareBaseData();
        this.#computeGovernorSkill();
        this.#computeRequiredGrowth();
        this.#computeProfitFactor();
    }

    /** @inheritdoc */
    prepareDerivedData() {
        super.prepareDerivedData();
        this.#prepareItemsLists();
        this.#prepareGovernorReference();
        this.#computeSlots();
        this.#computeYearlyGains();   
    }

    #prepareItemsLists() {
        const items = this.parent?.items ?? [];
        const resources = [];
        const upgrades = [];
        const isResource = (item) => item.system instanceof PlanetaryResourceModel;
        const isUpgrade = (item) => item.system instanceof ColonyUpgradeModel;
        for (const item of items) {
            if (isResource(item)) resources.push(item);
            else if (isUpgrade(item)) upgrades.push(item);
        }
        this.resources = resources;
        this.upgrades = upgrades;
    }

    #prepareGovernorReference() {
        const governorData = this.governor;
        const actor = this.governor.actor;
        governorData.name = actor?.name ?? "Governor";
        governorData.img = actor?.img ?? "icons/svg/mystery-man.svg";
    }

    #computeSlots() {
        const base = this.development.baseSlots;
        const fromUpgrades = this.upgrades.reduce((total, upgrade) => total + upgrade.system.bonusSlots, 0);
        const occupied = this.upgrades.reduce((total, upgrade) => total + upgrade.system.usesUpgradeSlot ? 1 : 0, 0);
        this.slotsTotal = base + fromUpgrades;
        this.occupiedSlots = occupied;
    }

    #computeYearlyGains() {
        const gains = {
            loyalty: 0,
            prosperity: 0,
            security: 0,
        }
        for (const upgrade of this.upgrades) {
            gains.loyalty += upgrade.system.yearlyLoyalty;
            gains.prosperity += upgrade.system.yearlyProsperity;
            gains.security += upgrade.system.yearlySecurity;
        }
        const colonyModifier = ColonyType.DATA[this.colonyType].yearlyGainsModifier;
        gains.loyalty += colonyModifier.loyalty;
        gains.prosperity += colonyModifier.prosperity;
        gains.security += colonyModifier.security;
        this.stats.loyaltyGain = gains.loyalty;
        this.stats.prosperityGain = gains.prosperity;
        this.stats.securityGain = gains.security;
    }

    #computeRequiredGrowth() {
        const colonySize = this.stats.size;
        const colonyGrowthModifier = game.settings.get("rogue-trader", "colonyGrowthModifier") || 0;
        const growthBase = colonySize + colonyGrowthModifier;
        let requiredGrowth = 0;
        switch (colonySize) {
        case 0:
        case 1:
        case 2:
        case 3:
            requiredGrowth = growthBase;
            break;
        case 4:
        case 5:
            requiredGrowth = growthBase + 1;
            break;
        case 6:
        case 7:
            requiredGrowth = growthBase + 2;
            break;
        case 8:
        case 9:
            requiredGrowth = growthBase + 3;
            break;
        case 10:
        default:
            requiredGrowth = growthBase + 4;
            break;
        }
        this.stats.requiredGrowth = requiredGrowth;
    }

    #computeGovernorSkill() {
        const colonySize = this.stats.size;
        let result = 0;
        switch (colonySize) {
        case 0:
        case 1:
        case 2:
        case 3:
            result = 35;
            break;
        case 4:
        case 5:
            result = 40;
            break;
        case 6:
        case 7:
            result = 45;
            break;
        case 8:
            result = 50;
            break;
        case 9:
            result = 55;
            break;
        case 10:
        default:
            result = 60;
            break;
        }
        result += this.governor.advancedTraining ? 10 : 0;
        this.governor.skillBonus = result; 
    }

    #computeProfitFactor() {
        const colonySize = this.stats.size || 0;
        const conserveResourcesPenalty = this.stats.conservativeLastTick ? -2 : 0;
        if (colonySize < 0) {
            this.stats.profitFactor = 0;
            return;
        }
        if (colonySize < 10) {
            this.stats.profitFactor = Math.min(colonySize, 4) + (Math.max(0, colonySize - 4) * 2) + conserveResourcesPenalty;
        } else {
            this.stats.profitFactor = 18 + ((colonySize - 10) * 2) + conserveResourcesPenalty;
        }
    }
}