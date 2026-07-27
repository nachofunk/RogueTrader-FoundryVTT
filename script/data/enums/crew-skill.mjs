import { EnumBase } from "./enum-base.mjs";

export default class CrewSkill extends EnumBase {
	static DEFAULT = "competent";

	static DATA = Object.freeze({
		incompetent: { rating: 10, label: "SHIP.CREW_INCOMPETENT" },
		competent:   { rating: 30, label: "SHIP.CREW_COMPETENT" },
		crack:       { rating: 40, label: "SHIP.CREW_CRACK" },
		veteran:     { rating: 50, label: "SHIP.CREW_VETERAN" },
		elite:       { rating: 60, label: "SHIP.CREW_ELITE" }
	});
}
