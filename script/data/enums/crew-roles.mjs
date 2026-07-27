import { EnumBase } from "./enum-base.mjs";

export default class CrewRoles extends EnumBase {
    static DEFAULT = "lordCaptain";

    static DATA = {
        lordCaptain: {
            label: "SHIP.NAMED_CREW.LORD_CAPTAIN",
            rank: 1
        },
        firstOfficer: {
            label: "SHIP.NAMED_CREW.FIRST_OFFICER",
            rank: 2
        },
        enginseerPrime: {
            label: "SHIP.NAMED_CREW.PRIME_ENGINSEER",
            rank: 2
        },
        highFactotum: {
            label: "SHIP.NAMED_CREW.HIGH_FACTOTUM",
            rank: 2
        },
        masterArms: {
            label: "SHIP.NAMED_CREW.MASTER_ARMS",
            rank: 3
        },
        masterHelmsman: {
            label: "SHIP.NAMED_CREW.MASTER_HELMSMAN",
            rank: 3
        },
        masterOrdnance: {
            label: "SHIP.NAMED_CREW.MASTER_ORDNANCE",
            rank: 3
        },
        masterEtherics: {
            label: "SHIP.NAMED_CREW.MASTER_ETHERICS",
            rank: 3
        },
        masterChirurgeon: {
            label: "SHIP.NAMED_CREW.MASTER_CHIRURGEON",
            rank: 3
        },
        masterWhispers: {
            label: "SHIP.NAMED_CREW.MASTER_WHISPERS",
            rank: 3
        },
        masterTelepathica: {
            label: "SHIP.NAMED_CREW.MASTER_TELEPATHICA",
            rank: 3
        },
        masterWarp: {
            label: "SHIP.NAMED_CREW.MASTER_WARP",
            rank: 3
        },
        confessor: {
            label: "SHIP.NAMED_CREW.CONFESSOR",
            rank: 4
        },
        drivesmaster: {
            label: "SHIP.NAMED_CREW.DRIVESMASTER",
            rank: 4
        },
        congregator: {
            label: "SHIP.NAMED_CREW.CONGREGATOR",
            rank: 4
        },
        bosun: {
            label: "SHIP.NAMED_CREW.CHIEF_BOSUN",
            rank: 4
        },
        infernus: {
            label: "SHIP.NAMED_CREW.INFERNUS_MASTER",
            rank: 4
        },
        twistcatcher: {
            label: "SHIP.NAMED_CREW.TWISTCATCHER",
            rank: 4
        },
        voxmaster: {
            label: "SHIP.NAMED_CREW.VOXMASTER",
            rank: 4
        },
        purser: {
            label: "SHIP.NAMED_CREW.PURSER",
            rank: 4
        },
        cartographer: {
            label: "SHIP.NAMED_CREW.CARTOGRAPHER",
            rank: 4
        },
        steward: {
            label: "SHIP.NAMED_CREW.STEWARD",
            rank: 4
        }
    }
}