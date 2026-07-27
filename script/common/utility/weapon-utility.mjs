export default class WeaponUtility {
    static extractWeaponTraits(traits) {
        // These weapon traits never go above 9 or below 2
        return {
            accurate: WeaponUtility.#hasNamedTrait(/Accurate/gi, traits),
            rfFace: WeaponUtility.#extractNumberedTrait(/Vengeful\s*\(?\s*\d+\s*\)?/gi, traits), // The alternativ die face Righteous Fury is triggered on
            proven: WeaponUtility.#extractNumberedTrait(/Proven\s*\(?\s*\d+\s*\)?/gi, traits),
            primitive: WeaponUtility.#extractNumberedTrait(/Primitive\s*\(?\s*\d+\s*\)?/gi, traits),
            razorSharp: WeaponUtility.#hasNamedTrait(/Razor *Sharp/gi, traits),
            skipAttackRoll: WeaponUtility.#hasNamedTrait(/Spray/gi, traits),
            tearing: WeaponUtility.#hasNamedTrait(/Tearing/gi, traits),
            force: WeaponUtility.#hasNamedTrait(/Force/gi, traits),
            warp: WeaponUtility.#hasNamedTrait(/Warp/gi, traits),
            scatter: WeaponUtility.#hasNamedTrait(/Scatter/gi, traits),
            melta: WeaponUtility.#hasNamedTrait(/Melta/gi, traits),
            maximal: WeaponUtility.#hasNamedTrait(/Maximal/gi, traits),
            storm: WeaponUtility.#hasNamedTrait(/Storm/gi, traits),
            twinLinked: WeaponUtility.#hasNamedTrait(/twin[\s\W_]*linked/i, traits),
        };
    }

    static #extractNumberedTrait(regex, traits) {
        let rfMatch = traits.match(regex);
        if (rfMatch) {
            regex = /\d+/gi;
            return parseInt(rfMatch[0].match(regex)[0]);
        }
        return undefined;
    }

    static #hasNamedTrait(regex, traits) {
        return traits.match(regex);
    }
}