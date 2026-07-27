import { EnumBase } from "./enum-base.mjs";
import { default as Characteristics } from "./characteristics.mjs";
import { capitalizeWordsInString } from "../../utils/string-utility.mjs";
const Characteristic = Characteristics.DATA;

export default class Skills extends EnumBase {
    static DEFAULT = "awareness";
    
    static DATA = Object.freeze({
        ...this.#basicSkills(),
        ...this.#advancedAg(),
        ...this.#advancedInt(),
        ...this.#advancedPer(),
        ...this.#advancedWP(),
        ...this.#advancedFel(),
        ...this.#ciphers(),
        ...this.#commonLore(),
        ...this.#drive(),
        ...this.#forbiddenLore(),
        ...this.#navigate(),
        ...this.#performer(),
        ...this.#pilot(),
        ...this.#scholasticLore(),
        ...this.#secretTongue(),
        ...this.#speakLanguage(),
        ...this.#trade(),
    });

        /** UI: localized labels + metadata */
    static options(useFullLabel = false) {
        return Object.fromEntries(
            Object.entries(this.DATA).map(([key, data]) => [
                key,
                {
                ...data,
                label: Skills.#getLabel(data, useFullLabel),
                }
            ])
        );
    }

    static bySkillGroup() {
        const groups = {};
        for (const [key, data] of Object.entries(this.DATA)) {
            const group = data.group;
            if (!groups[group]) {
                groups[group] = {};
            }
            groups[group][key] = key;
        }
        return groups;
    }

    static #getLabel(skill, useFullLabel) {
        const skillName = game.i18n.localize(skill.label);
        const prefix = game.i18n.localize(skill.groupLabel);
        return useFullLabel && skill.isSpecialist ? `${prefix}: ${skillName}` : skillName;
    }

    static #charKey(value) { return Characteristics.keyOf(value) };

    static #basicSkills() {
        return { 
            awareness: {
                label: "SKILL.AWARENESS",
                isSpecialist: false,
                group: "base",
                groupLabel: "SKILL.BASE",
                characteristic: this.#charKey(Characteristic.perception)
            },
            barter: {
                label: "SKILL.BARTER",
                isSpecialist: false,
                group: "base",
                groupLabel: "SKILL.BASE",
                characteristic: this.#charKey(Characteristic.fellowship)
            },
            carouse: {
                label: "SKILL.CAROUSE",
                isSpecialist: false,
                group: "base",
                groupLabel: "SKILL.BASE",
                characteristic: this.#charKey(Characteristic.toughness)
            },
            climb: {
                label: "SKILL.CLIMB",
                isSpecialist: false,
                group: "base",
                groupLabel: "SKILL.BASE",
                characteristic: this.#charKey(Characteristic.strength)
            },
            command: {
                label: "SKILL.COMMAND",
                isSpecialist: false,
                group: "base",
                groupLabel: "SKILL.BASE",
                characteristic: this.#charKey(Characteristic.fellowship)
            },
            concealment: {
                label: "SKILL.CONCEALMENT",
                isSpecialist: false,
                group: "base",
                groupLabel: "SKILL.BASE",
                characteristic: this.#charKey(Characteristic.agility)
            },
            deceive: {
                label: "SKILL.DECEIVE",
                isSpecialist: false,
                group: "base",
                groupLabel: "SKILL.BASE",
                characteristic: this.#charKey(Characteristic.fellowship)
            },
            disguise: {
                label: "SKILL.DISGUISE",
                isSpecialist: false,
                group: "base",
                groupLabel: "SKILL.BASE",
                characteristic: this.#charKey(Characteristic.fellowship)
            },
            dodge: {
                label: "SKILL.DODGE",
                isSpecialist: false,
                group: "base",
                groupLabel: "SKILL.BASE",
                characteristic: this.#charKey(Characteristic.agility)
            },
            inquiry: {
                label: "SKILL.INQUIRY",
                isSpecialist: false,
                group: "base",
                groupLabel: "SKILL.BASE",
                characteristic: this.#charKey(Characteristic.fellowship)
            },
            intimidate: {
                label: "SKILL.INTIMIDATE",
                isSpecialist: false,
                group: "base",
                groupLabel: "SKILL.BASE",
                characteristic: this.#charKey(Characteristic.strength)
            },
            logic: {
                label: "SKILL.LOGIC",
                isSpecialist: false,
                group: "base",
                groupLabel: "SKILL.BASE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            scrutiny: {
                label: "SKILL.SCRUTINY",
                isSpecialist: false,
                group: "base",
                groupLabel: "SKILL.BASE",
                characteristic: this.#charKey(Characteristic.perception)
            },
            search: {
                label: "SKILL.SEARCH",
                isSpecialist: false,
                group: "base",
                groupLabel: "SKILL.BASE",
                characteristic: this.#charKey(Characteristic.perception)
            },
            silentMove: {
                label: "SKILL.SILENT-MOVE",
                isSpecialist: false,
                group: "base",
                groupLabel: "SKILL.BASE",
                characteristic: this.#charKey(Characteristic.agility)
            },
            swim: {
                label: "SKILL.SWIM",
                isSpecialist: false,
                group: "base",
                groupLabel: "SKILL.BASE",
                characteristic: this.#charKey(Characteristic.strength)
            },
            techUse: {
                label: "SKILL.TECH_USE",
                isSpecialist: false,
                group: "base",
                groupLabel: "SKILL.BASE",
                characteristic: this.#charKey(Characteristic.intelligence)
            }
        }
    }

    static #advancedAg() {
        return {
            acrobatics: {
                label: "SKILL.ACROBATICS",
                isSpecialist: true,
                group: "advAg",
                groupLabel: "SKILL.ADVANCED-AG",
                characteristic: this.#charKey(Characteristic.agility)
            },
            security: {
                label: "SKILL.SECURITY",
                isSpecialist: true,
                group: "advAg",
                groupLabel: "SKILL.ADVANCED-AG",
                characteristic: this.#charKey(Characteristic.agility)
            },
            shadowing: {
                label: "SKILL.SHADOWING",
                isSpecialist: true,
                group: "advAg",
                groupLabel: "SKILL.ADVANCED-AG",
                characteristic: this.#charKey(Characteristic.agility)
            },
            sleightOfHand: {
                label: "SKILL.SLEIGHT_OF_HAND",
                isSpecialist: true,
                group: "advAg",
                groupLabel: "SKILL.ADVANCED-AG",
                characteristic: this.#charKey(Characteristic.agility)
            },
        }
    }

    static #advancedInt() {
        return { 
            chemUse: {
                label: "SKILL.CHEM-USE",
                isSpecialist: true,
                group: "advInt",
                groupLabel: "SKILL.ADVANCED-INT",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            demolition: {
                label: "SKILL.DEMOLITION",
                isSpecialist: true,
                group: "advInt",
                groupLabel: "SKILL.ADVANCED-INT",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            evaluate: {
                label: "SKILL.EVALUATE",
                isSpecialist: true,
                group: "advInt",
                groupLabel: "SKILL.ADVANCED-INT",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            gamble: {
                label: "SKILL.GAMBLE",
                isSpecialist: true,
                group: "advInt",
                groupLabel: "SKILL.ADVANCED-INT",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            literacy: {
                label: "SKILL.LITERACY",
                isSpecialist: true,
                group: "advInt",
                groupLabel: "SKILL.ADVANCED-INT",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            medicae: {
                label: "SKILL.MEDICAE",
                isSpecialist: true,
                group: "advInt",
                groupLabel: "SKILL.ADVANCED-INT",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            survival: {
                label: "SKILL.SURVIVAL",
                isSpecialist: true,
                group: "advInt",
                groupLabel: "SKILL.ADVANCED-INT",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            tracking: {
                label: "SKILL.TRACKING",
                isSpecialist: true,
                group: "advInt",
                groupLabel: "SKILL.ADVANCED-INT",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            wrangler: {
                label: "SKILL.WRANGLER",
                isSpecialist: true,
                group: "advInt",
                groupLabel: "SKILL.ADVANCED-INT",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
        }
    }

    static #advancedPer() {
        return {
            psyniscience: {
                label: "SKILL.PSYNISCIENCE",
                isSpecialist: true,
                group: "advPer",
                groupLabel: "SKILL.ADVANCED-PER",
                characteristic: this.#charKey(Characteristic.perception)
            },
        }
    }

    static #advancedWP() {
        return {
            interrogation: {
                label: "SKILL.INTERROGATION",
                isSpecialist: true,
                group: "advWP",
                groupLabel: "SKILL.ADVANCED-WP",
                characteristic: this.#charKey(Characteristic.willpower)
            },
            invocation: {
                label: "SKILL.INVOCATION",
                isSpecialist: true,
                group: "advWP",
                groupLabel: "SKILL.ADVANCED-WP",
                characteristic: this.#charKey(Characteristic.willpower)
            },
        }
    }

    static #advancedFel() {
        return { 
            blather: {
                label: "SKILL.BLATHER",
                isSpecialist: true,
                group: "advFel",
                groupLabel: "SKILL.ADVANCED-FEL",
                characteristic: this.#charKey(Characteristic.fellowship)
            },
            charm: {
                label: "SKILL.CHARM",
                isSpecialist: true,
                group: "advFel",
                groupLabel: "SKILL.ADVANCED-FEL",
                characteristic: this.#charKey(Characteristic.fellowship)
            },
            commerce: {
                label: "SKILL.COMMERCE",
                isSpecialist: true,
                group: "advFel",
                groupLabel: "SKILL.ADVANCED-FEL",
                characteristic: this.#charKey(Characteristic.fellowship)
            },
        }
    }

    static #ciphers() {
        return { 
            ciphers_rogueTraders: {
                label: "SKILL.ROGUE-TRADERS",
                isSpecialist: true,
                group: "ciphers",
                groupLabel: "SKILL.CIPHERS",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            ciphers_mercenaryCant: {
                label: "SKILL.MERCENARY-CANT",
                isSpecialist: true,
                group: "ciphers",
                groupLabel: "SKILL.CIPHERS",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            ciphers_nobiliteFamily: {
                label: "SKILL.NOBILITE-FAMILY",
                isSpecialist: true,
                group: "ciphers",
                groupLabel: "SKILL.CIPHERS",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            ciphers_astropathSign: {
                label: "SKILL.ASTROPATH-SIGN",
                isSpecialist: true,
                group: "ciphers",
                groupLabel: "SKILL.CIPHERS",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            ciphers_underworld: {
                label: "SKILL.UNDERWORLD",
                isSpecialist: true,
                group: "ciphers",
                groupLabel: "SKILL.CIPHERS",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
        }
    }

    static #commonLore() {
        return {
            commonLore_adeptaSororitas: {
                label: "SKILL.ADEPTA-SORORITAS",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            commonLore_adeptusArbites: {
                label: "SKILL.ADEPTUS-ARBITES",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            commonLore_adeptusAstartes: {
                label: "SKILL.ADEPTUS-ASTARTES",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            commonLore_adeptusAstraTelepathica: {
                label: "SKILL.ADEPTUS-ASTRATELEPATHICA",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            commonLore_adeptusMechanicus: {
                label: "SKILL.ADEPTUS-MECHANICUS",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            commonLore_administratum: {
                label: "SKILL.ADMINISTRATUM",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            commonLore_ecclesiarchy: {
                label: "SKILL.ECCLESIARCHY",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            commonLore_imperialCreed: {
                label: "SKILL.IMPERIAL-CREED",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            commonLore_imperialGuard: {
                label: "SKILL.IMPERIAL-GUARD",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            commonLore_imperialNavy: {
                label: "SKILL.IMPERIAL-NAVY",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            commonLore_imperium: {
                label: "SKILL.IMPERIUM",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            commonLore_koronousExpanse: {
                label: "SKILL.KORONOUS-EXPANSE",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            commonLore_machineCult: {
                label: "SKILL.MACHINE-CULT",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            commonLore_navisNobilite: {
                label: "SKILL.NAVIS-NOBILITE",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            commonLore_rogueTraders: {
                label: "SKILL.ROGUE-TRADERS",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            commonLore_tech: {
                label: "SKILL.TECH",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            commonLore_war: {
                label: "SKILL.WAR",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            commonLore_underworld: {
                label: "SKILL.UNDERWORLD",
                isSpecialist: true,
                group: "commonLore",
                groupLabel: "SKILL.COMMON_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
        }
    }

    static #drive() {
        return { 
            drive_groundVehicle: {
                label: "SKILL.GROUND-VEHICLE",
                isSpecialist: true,
                group: "drive",
                groupLabel: "SKILL.DRIVE",
                characteristic: this.#charKey(Characteristic.agility)
            },
            drive_skimmerHover: {
                label: "SKILL.SKIMMER-HOVER",
                isSpecialist: true,
                group: "drive",
                groupLabel: "SKILL.DRIVE",
                characteristic: this.#charKey(Characteristic.agility)
            },
            drive_walker: {
                label: "SKILL.WALKER",
                isSpecialist: true,
                group: "drive",
                groupLabel: "SKILL.DRIVE",
                characteristic: this.#charKey(Characteristic.agility)
            },
        }
    }

    static #forbiddenLore() {
        return {
            forbiddenLore_adeptusMechanicus: {
                label: "SKILL.ADEPTUS-MECHANICUS",
                isSpecialist: true,
                group: "forbiddenLore",
                groupLabel: "SKILL.FORBIDDEN_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            forbiddenLore_archaeotech: {
                label: "SKILL.ARCHAEOTECH",
                isSpecialist: true,
                group: "forbiddenLore",
                groupLabel: "SKILL.FORBIDDEN_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            forbiddenLore_daemonology: {
                label: "SKILL.DAEMONOLOGY",
                isSpecialist: true,
                group: "forbiddenLore",
                groupLabel: "SKILL.FORBIDDEN_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            forbiddenLore_heresy: {
                label: "SKILL.HERESY",
                isSpecialist: true,
                group: "forbiddenLore",
                groupLabel: "SKILL.FORBIDDEN_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            forbiddenLore_inquisition: {
                label: "SKILL.INQUISITION",
                isSpecialist: true,
                group: "forbiddenLore",
                groupLabel: "SKILL.FORBIDDEN_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            forbiddenLore_mutants: {
                label: "SKILL.MUTANTS",
                isSpecialist: true,
                group: "forbiddenLore",
                groupLabel: "SKILL.FORBIDDEN_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            forbiddenLore_navigators: {
                label: "SKILL.NAVIGATORS",
                isSpecialist: true,
                group: "forbiddenLore",
                groupLabel: "SKILL.FORBIDDEN_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            forbiddenLore_pirates: {
                label: "SKILL.PIRATES",
                isSpecialist: true,
                group: "forbiddenLore",
                groupLabel: "SKILL.FORBIDDEN_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            forbiddenLore_psykers: {
                label: "SKILL.PSYKERS",
                isSpecialist: true,
                group: "forbiddenLore",
                groupLabel: "SKILL.FORBIDDEN_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            forbiddenLore_theWarp: {
                label: "SKILL.THE-WARP",
                isSpecialist: true,
                group: "forbiddenLore",
                groupLabel: "SKILL.FORBIDDEN_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            forbiddenLore_xenos: {
                label: "SKILL.XENOS",
                isSpecialist: true,
                group: "forbiddenLore",
                groupLabel: "SKILL.FORBIDDEN_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
        }
    }

    static #navigate() {
        return {
            navigate_surface: {
                label: "SKILL.SURFACE",
                isSpecialist: true,
                group: "navigate",
                groupLabel: "SKILL.NAVIGATE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            navigate_stellar: {
                label: "SKILL.STELLAR",
                isSpecialist: true,
                group: "navigate",
                groupLabel: "SKILL.NAVIGATE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            navigate_warp: {
                label: "SKILL.WARP",
                isSpecialist: true,
                group: "navigate",
                groupLabel: "SKILL.NAVIGATE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
        }
    }

    static #performer() {
        return {
            performer_dancer: {
                label: "SKILL.DANCER",
                isSpecialist: true,
                group: "performer",
                groupLabel: "SKILL.PERFORMER",
                characteristic: this.#charKey(Characteristic.fellowship)
            },
            performer_musician: {
                label: "SKILL.MUSICIAN",
                isSpecialist: true,
                group: "performer",
                groupLabel: "SKILL.PERFORMER",
                characteristic: this.#charKey(Characteristic.fellowship)
            },
            performer_singer: {
                label: "SKILL.SINGER",
                isSpecialist: true,
                group: "performer",
                groupLabel: "SKILL.PERFORMER",
                characteristic: this.#charKey(Characteristic.fellowship)
            },
            performer_storyteller: {
                label: "SKILL.STORYTELLER",
                isSpecialist: true,
                group: "performer",
                groupLabel: "SKILL.PERFORMER",
                characteristic: this.#charKey(Characteristic.fellowship)
            },
        }
    }

    static #pilot() {
        return {
            pilot_personal: {
                label: "SKILL.PERSONAL",
                isSpecialist: true,
                group: "pilot",
                groupLabel: "SKILL.PILOT",
                characteristic: this.#charKey(Characteristic.agility)
            },
            pilot_flyers: {
                label: "SKILL.FLYERS",
                isSpecialist: true,
                group: "pilot",
                groupLabel: "SKILL.PILOT",
                characteristic: this.#charKey(Characteristic.agility)
            },
            pilot_spacecraft: {
                label: "SKILL.SPACE-CRAFT",
                isSpecialist: true,
                group: "pilot",
                groupLabel: "SKILL.PILOT",
                characteristic: this.#charKey(Characteristic.agility)
            },
        }
    }

    static #scholasticLore() {
        return {
            scholasticLore_archaic: {
                label: "SKILL.ARCHAIC",
                isSpecialist: true,
                group: "scholasticLore",
                groupLabel: "SKILL.SCHOLASTIC_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            scholasticLore_astromancy: {
                label: "SKILL.ASTROMANCY",
                isSpecialist: true,
                group: "scholasticLore",
                groupLabel: "SKILL.SCHOLASTIC_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            scholasticLore_beasts: {
                label: "SKILL.BEASTS",
                isSpecialist: true,
                group: "scholasticLore",
                groupLabel: "SKILL.SCHOLASTIC_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            scholasticLore_bureaucracy: {
                label: "SKILL.BUREAUCRACY",
                isSpecialist: true,
                group: "scholasticLore",
                groupLabel: "SKILL.SCHOLASTIC_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            scholasticLore_chymistry: {
                label: "SKILL.CHYMISTRY",
                isSpecialist: true,
                group: "scholasticLore",
                groupLabel: "SKILL.SCHOLASTIC_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            scholasticLore_cryptology: {
                label: "SKILL.CRYPTOLOGY",
                isSpecialist: true,
                group: "scholasticLore",
                groupLabel: "SKILL.SCHOLASTIC_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            scholasticLore_heraldry: {
                label: "SKILL.HERALDRY",
                isSpecialist: true,
                group: "scholasticLore",
                groupLabel: "SKILL.SCHOLASTIC_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            scholasticLore_imperialWarrants: {
                label: "SKILL.IMPERIAL-WARRANTS",
                isSpecialist: true,
                group: "scholasticLore",
                groupLabel: "SKILL.SCHOLASTIC_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            scholasticLore_imperialCreed: {
                label: "SKILL.IMPERIAL-CREED",
                isSpecialist: true,
                group: "scholasticLore",
                groupLabel: "SKILL.SCHOLASTIC_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            scholasticLore_judgement: {
                label: "SKILL.JUDGEMENT",
                isSpecialist: true,
                group: "scholasticLore",
                groupLabel: "SKILL.SCHOLASTIC_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            scholasticLore_legend: {
                label: "SKILL.LEGEND",
                isSpecialist: true,
                group: "scholasticLore",
                groupLabel: "SKILL.SCHOLASTIC_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            scholasticLore_navisNobilite: {
                label: "SKILL.NAVIS-NOBILITE",
                isSpecialist: true,
                group: "scholasticLore",
                groupLabel: "SKILL.SCHOLASTIC_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            scholasticLore_numerology: {
                label: "SKILL.NUMEROLOGY",
                isSpecialist: true,
                group: "scholasticLore",
                groupLabel: "SKILL.SCHOLASTIC_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            scholasticLore_occult: {
                label: "SKILL.OCCULT",
                isSpecialist: true,
                group: "scholasticLore",
                groupLabel: "SKILL.SCHOLASTIC_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            scholasticLore_philosophy: {
                label: "SKILL.PHILOSOPHY",
                isSpecialist: true,
                group: "scholasticLore",
                groupLabel: "SKILL.SCHOLASTIC_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            scholasticLore_tacticaImperialis: {
                label: "SKILL.TACTICA-IMPERIALIS",
                isSpecialist: true,
                group: "scholasticLore",
                groupLabel: "SKILL.SCHOLASTIC_LORE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
        }
    }

    static #secretTongue() {
        return {
            secretTongue_administratum: {
                label: "SKILL.ADMINISTRATUM",
                isSpecialist: true,
                group: "secretTongue",
                groupLabel: "SKILL.SECRET-TONGUE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            secretTongue_ecclesiarchy: {
                label: "SKILL.ECCLESIARCHY",
                isSpecialist: true,
                group: "secretTongue",
                groupLabel: "SKILL.SECRET-TONGUE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            secretTongue_military: {
                label: "SKILL.MILITARY",
                isSpecialist: true,
                group: "secretTongue",
                groupLabel: "SKILL.SECRET-TONGUE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            secretTongue_navigators: {
                label: "SKILL.NAVIGATORS",
                isSpecialist: true,
                group: "secretTongue",
                groupLabel: "SKILL.SECRET-TONGUE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            secretTongue_rogueTrader: {
                label: "SKILL.ROGUE-TRADERS",
                isSpecialist: true,
                group: "secretTongue",
                groupLabel: "SKILL.SECRET-TONGUE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            secretTongue_tech: {
                label: "SKILL.TECH",
                isSpecialist: true,
                group: "secretTongue",
                groupLabel: "SKILL.SECRET-TONGUE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            secretTongue_underdeck: {
                label: "SKILL.UNDERDECK",
                isSpecialist: true,
                group: "secretTongue",
                groupLabel: "SKILL.SECRET-TONGUE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
        }
    }

    static #speakLanguage() {
        return {
            speakLanguage_eldar: {
                label: "SKILL.ELDAR",
                isSpecialist: true,
                group: "speakLanguage",
                groupLabel: "SKILL.SPEAK-LANGUAGE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            speakLanguage_exploratorBinary: {
                label: "SKILL.EXPLORATOR-BINARY",
                isSpecialist: true,
                group: "speakLanguage",
                groupLabel: "SKILL.SPEAK-LANGUAGE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            speakLanguage_highGothic: {
                label: "SKILL.HIGH-GOTHIC",
                isSpecialist: true,
                group: "speakLanguage",
                groupLabel: "SKILL.SPEAK-LANGUAGE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            speakLanguage_hiveDialect: {
                label: "SKILL.HIVE-DIALECT",
                isSpecialist: true,
                group: "speakLanguage",
                groupLabel: "SKILL.SPEAK-LANGUAGE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            speakLanguage_lowGothic: {
                label: "SKILL.LOW-GOTHIC",
                isSpecialist: true,
                group: "speakLanguage",
                groupLabel: "SKILL.SPEAK-LANGUAGE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            speakLanguage_ork: {
                label: "SKILL.ORK",
                isSpecialist: true,
                group: "speakLanguage",
                groupLabel: "SKILL.SPEAK-LANGUAGE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            speakLanguage_shipDialect: {
                label: "SKILL.SHIP-DIALECT",
                isSpecialist: true,
                group: "speakLanguage",
                groupLabel: "SKILL.SPEAK-LANGUAGE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            speakLanguage_technaLingua: {
                label: "SKILL.TECHNA-LINGUA",
                isSpecialist: true,
                group: "speakLanguage",
                groupLabel: "SKILL.SPEAK-LANGUAGE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            speakLanguage_tradersCant: {
                label: "SKILL.TRADERS-CANT",
                isSpecialist: true,
                group: "speakLanguage",
                groupLabel: "SKILL.SPEAK-LANGUAGE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
        }
    }

    static #trade() {
        return {
            trade_agri: {
                label: "SKILL.AGRI",
                isSpecialist: true,
                group: "trade",
                groupLabel: "SKILL.TRADE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            trade_archaeologist: {
                label: "SKILL.ARCHAEOLOGIST",
                isSpecialist: true,
                group: "trade",
                groupLabel: "SKILL.TRADE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            trade_armourer: {
                label: "SKILL.ARMOURER",
                isSpecialist: true,
                group: "trade",
                groupLabel: "SKILL.TRADE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            trade_astrographer: {
                label: "SKILL.ASTROGRAPHER",
                isSpecialist: true,
                group: "trade",
                groupLabel: "SKILL.TRADE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            trade_chymist: {
                label: "SKILL.CHYMIST",
                isSpecialist: true,
                group: "trade",
                groupLabel: "SKILL.TRADE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            trade_cryptographer: {
                label: "SKILL.CRYPTOGRAPHER",
                isSpecialist: true,
                group: "trade",
                groupLabel: "SKILL.TRADE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            trade_cook: {
                label: "SKILL.COOK",
                isSpecialist: true,
                group: "trade",
                groupLabel: "SKILL.TRADE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            trade_explorator: {
                label: "SKILL.EXPLORATOR",
                isSpecialist: true,
                group: "trade",
                groupLabel: "SKILL.TRADE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            trade_linguist: {
                label: "SKILL.LINGUIST",
                isSpecialist: true,
                group: "trade",
                groupLabel: "SKILL.TRADE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            trade_remembrancer: {
                label: "SKILL.REMEMBRANCER",
                isSpecialist: true,
                group: "trade",
                groupLabel: "SKILL.TRADE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            trade_shipwright: {
                label: "SKILL.SHIPWRIGHT",
                isSpecialist: true,
                group: "trade",
                groupLabel: "SKILL.TRADE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            trade_soothsayer: {
                label: "SKILL.SOOTHSAYER",
                isSpecialist: true,
                group: "trade",
                groupLabel: "SKILL.TRADE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            trade_technomat: {
                label: "SKILL.TECHNOMAT",
                isSpecialist: true,
                group: "trade",
                groupLabel: "SKILL.TRADE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            trade_trader: {
                label: "SKILL.TRADER",
                isSpecialist: true,
                group: "trade",
                groupLabel: "SKILL.TRADE",
                characteristic: this.#charKey(Characteristic.intelligence)
            },
            trade_voidfarer: {
                label: "SKILL.VOIDFARER",
                isSpecialist: true,
                group: "trade",
                groupLabel: "SKILL.TRADE",
                characteristic: this.#charKey(Characteristic.intelligence)
            }
        }
    }

    static convertLegacyKey(key) {
        if (Skills.DATA[key]) return key;
        const capitalized = capitalizeWordsInString(key, 
            ["lore", "warrants", "nobilite", "imperialis", "creed"]
        )
        if (Skills.DATA[capitalized]) return capitalized;
        if (capitalized.startsWith("pilot")) {
            let lowerCasePilot = capitalized.toLowerCase();
            if (Skills.DATA[lowerCasePilot]) return lowerCasePilot;
        }
        switch (key) {
            case `sleightofhand`: return Skills.KEYS.sleightOfHand;
            case `techuse`: return Skills.KEYS.techUse;
            default: { 
                console.error(`Failed to parse string ${key}`);
                return "ERROR!"
            };
        }
    }
}