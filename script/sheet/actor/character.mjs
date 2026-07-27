import RogueTraderSheet from "./actor.mjs";
import { prepareCommonRoll, prepareCombatRoll, preparePsychicPowerRoll, prepareForceFieldRoll } from "../../common/dialog.js";
import { Skills, SkillAdvance, Characteristics, CharacteristicAdvance } from "../../data/enums/_module.mjs";
import { CharacterRollData } from "../../common/roll-data/_module.mjs";
import RogueTraderUtil from "../../common/util.mjs"
export default class CharacterSheet extends RogueTraderSheet {

    static DEFAULT_OPTIONS = {
        position: {
            width: 720,
            height: 916
        },
        actions: {
            rollCharacteristic: CharacterSheet.#rollCharacteristic,
            rollSkill: CharacterSheet.#rollSkill,
            rollInsanity: CharacterSheet.#rollInsanity,
            rollCorruption: CharacterSheet.#rollCorruption,
            rollWeapon: CharacterSheet.#rollWeapon,
            rollForceField: CharacterSheet.#rollForceField,
            rollPsychicPower: CharacterSheet.#rollPsychicPower
        }
    }

    static PARTS = {
        ...super.PARTS,
        tabs: {
            // Foundry-provided generic template
            template: 'templates/generic/tab-navigation.hbs',
            // classes: ['sysclass'] // Optionally add extra classes to the part for extra customization
        },
    }

    static TABS = {
        primary: {
            tabs: [
                {
                    id: "stats",
                    group: "primary",
                    label: "TAB.STATS",
                    icon: "fa-solid fa-chart-bar",
                    cssClass: "tab-stats"
                },
                {
                    id: "combat",
                    group: "primary",
                    label: "TAB.COMBAT",
                    icon: "fa-solid fa-shield",
                    cssClass: "tab-combat"
                },
                {
                    id: "abilities",
                    group: "primary",
                    label: "TAB.ABILITIES",
                    icon: "fa-solid fa-star",
                    cssClass: "tab-abilities"
                },
                {
                    id: "psychic-powers",
                    group: "primary",
                    label: "TAB.PSYCHIC_POWERS",
                    icon: "fa-solid fa-wand-magic-sparkles",
                    cssClass: "tab-psychic-powers"
                },
                {
                    id: "gear",
                    group: "primary",
                    label: "TAB.GEAR",
                    icon: "fa-solid fa-backpack",
                    cssClass: "tab-gear"
                },
                {
                    id: "progression",
                    group: "primary",
                    label: "TAB.ADVANCES",
                    icon: "fa-solid fa-arrow-up",
                    cssClass: "tab-progression"
                },
                {
                    id: "notes",
                    group: "primary",
                    label: "TAB.NOTES",
                    icon: "fa-solid fa-note-sticky",
                    cssClass: "flex tab-notes"
                }
            ],
            initial: "stats"
        }
    };

    /**
     * Handle characteristic roll.
     * @this {RogueTraderSheet}
     * @param {PointerEvent} event
     * @param {HTMLElement} target
     */
    static async #rollCharacteristic(event, target) {
        event.preventDefault();
        const characteristicName = target.dataset.characteristic;
        const rollData = CharacterRollData.createCharacteristicRollData(this.document, characteristicName);
        await prepareCommonRoll(rollData);
    }

    /**
     * Handle skill roll.
     * @this {RogueTraderSheet}
     * @param {PointerEvent} event
     * @param {HTMLElement} target
     */
    static async #rollSkill(event, target) {
        event.preventDefault();
        const skillName = target.dataset.skill;
        const skill = this.document.system.skills[skillName];
        const valueByChar = {};
        for (const char of Object.keys(Characteristics.DATA)) {
            valueByChar[char] = skill.byCharacteristic(char);
        }

        const rollData = {
            actor: this.document,
            skill: skill,
            name: skill.label,
            baseTarget: skill.value,
            modifier: skill.itemBonus.rollBonus,
            rolledWith: skill.characteristic,
            characteristics: valueByChar,
            charOptions: Characteristics.options(),
            ownerId: this.document.id,
            unnatural: 0
        };
        await prepareCommonRoll(rollData);
    }

    /**
     * Handle insanity roll.
     * @this {RogueTraderSheet}
     * @param {PointerEvent} event
     * @param {HTMLElement} target
     */
    static async #rollInsanity(event, target) {
        event.preventDefault();
        const characteristic = this.document.system.characteristics.willpower;
        const rollData = {
            name: "FEAR.HEADER",
            baseTarget: characteristic.value,
            modifier: 0,
            ownerId: this.document.id
        };
        await prepareCommonRoll(rollData);
    }

    /**
     * Handle corruption roll.
     * @this {RogueTraderSheet}
     * @param {PointerEvent} event
     * @param {HTMLElement} target
     */
    static async #rollCorruption(event, target) {
        event.preventDefault();
        const system = this.document.system;
        const characteristic = system.characteristics.willpower;
        const corruption = system.corruption;
        const rollData = {
            name: "CORRUPTION.HEADER",
            baseTarget: characteristic.value,
            modifier: corruption.rollModifier,
            ownerId: this.document.id
        };
        await prepareCommonRoll(rollData);
    }

    /**
     * Handle weapon roll.
     * @this {RogueTraderSheet}
     * @param {PointerEvent} event
     * @param {HTMLElement} target
     */
    static async #rollWeapon(event, target) {
        event.preventDefault();
        const div = target.closest(".item");
        const weapon = this.document.items.get(div.dataset.itemId);
        await prepareCombatRoll(
            CharacterRollData.createWeaponRollData(this.document, weapon), 
            this.document
        );
    }

    /**
     * Handle force field roll.
     * @this {RogueTraderSheet}
     * @param {PointerEvent} event
     * @param {HTMLElement} target
     */
    static async #rollForceField(event, target) {
        event.preventDefault();
        const div = target.closest(".item");
        const forceField = this.document.items.get(div.dataset.itemId);
        await prepareForceFieldRoll(
            CharacterRollData.createForceFieldRollData(this.document, forceField),
            this.document
        );
    }

    /**
     * Handle psychic power roll.
     * @this {RogueTraderSheet}
     * @param {PointerEvent} event
     * @param {HTMLElement} target
     */
    static async #rollPsychicPower(event, target) {
        event.preventDefault();
        const div = target.closest(".item");
        const psychicPower = this.document.items.get(div.dataset.itemId);    
        await preparePsychicPowerRoll(
            CharacterRollData.createPsychicRollData(this.document, psychicPower)
        );
    }

    _prepareSkillGroups() {
        const skillData = this.document.system.skills;
        const skills = {
            advanced: {},
        };
        for (const [key, skill] of Object.entries(skillData)) {
            const group = skill.group;
            if (skill.isSpecialist) {
                if (!skills.advanced[group]) {
                    skills.advanced[group] = {
                        entries: {},
                        label: game.i18n.localize(skill.groupLabel)
                    };
                }
                skills.advanced[group].entries[key] = {
                    label: game.i18n.localize(skill.label),
                    total: skill.value,
                    advance: {
                        value: skill.advance,
                        short: SkillAdvance.DATA[skill.advance].short,
                    },
                    isKnown: skill.isKnown,
                    cost: skill.cost,
                };
            }
            else {
                if (!skills.base) {
                    skills.base = {
                        entries: {},
                        label: game.i18n.localize(skill.groupLabel)
                    };
                }
                skills.base.entries[key] = {
                    label: game.i18n.localize(skill.label),
                    total: skill.value,
                    advance: {
                        value: skill.advance,
                        short: SkillAdvance.DATA[skill.advance].short,
                    },
                    cost: skill.cost,
                };
            }
        }
        return skills;
    }

    _prepareCharacteristicGroups() {
        const charData = this.document.system.characteristics;
        const characteristics = {};
        let i = 0;
        const middle = Object.entries(charData).length / 2;
        for (const [key, char] of Object.entries(charData)) {
            characteristics[key] = {
                label: game.i18n.localize(char.label),
                base: char.base,
                total: char.value,
                advance: {
                    value: char.advance,
                    short: CharacteristicAdvance.DATA[char.advance].short
                },
                unnatural: char.unnatural.base,
                cost: char.cost,
                bonus: char.bonus,
                isLeft: i < middle,
                isRight: i >= middle
            }
            i++;
        }
        return characteristics;
    }

    async _prepareContext(options) {
        const context = await super._prepareContext(options);
        context.skills = this._prepareSkillGroups();
        context.characteristics = this._prepareCharacteristicGroups();
        context.items = this._constructItemLists();
        return context;
    }

    _constructItemLists() {
        const items = super._constructItemLists();
        let itemTypes = this.document.itemTypes;
        items.mentalDisorders = itemTypes["mentalDisorder"];
        items.malignancies = itemTypes["malignancy"];
        items.mutations = itemTypes["mutation"];
        if (this.document.type === "npc") {
            items.abilities = itemTypes["talent"]
            .concat(itemTypes["trait"])
            .concat(itemTypes["specialAbility"]);
        }
        items.talents = itemTypes["talent"];
        items.traits = itemTypes["trait"];
        items.specialAbilities = itemTypes["specialAbility"];
        items.aptitudes = itemTypes["aptitude"];
        items.psychicPowers = itemTypes["psychicPower"];
        items.criticalInjuries = itemTypes["criticalInjury"];
        items.gear = itemTypes["gear"];
        items.drugs = itemTypes["drug"];
        items.tools = itemTypes["tool"];
        items.cybernetics = itemTypes["cybernetic"];
        items.armour = itemTypes["armour"];
        items.forceFields = itemTypes["forceField"];
        items.weapons = itemTypes["weapon"];
        items.weaponMods = itemTypes["weaponModification"];
        items.ammunitions = itemTypes["ammunition"];
        this._sortItemLists(items)
        return items;
    }
}