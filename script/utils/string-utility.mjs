/**
 * Converts a string to camelCase.
 * @param {String} str 
 * @returns {String} camelCaseString
 */
export function toCamelCase(str) {
    if (typeof str !== "string") {
        console.error("Expected a string for toCamelCase conversion, received:", str);
        return str;
    }
    return str
        .toLowerCase()
        .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}

/**
 * Capitalizes the first letter of specific words inside a compound string.
 * Example:
 *   "scholasticlore_imperialwarrants", ["lore", "warrants"]
 *   → "scholasticLore_imperialWarrants"
 */
export function capitalizeWordsInString(str, words) {
    if (typeof str !== "string") return str;
    if (!Array.isArray(words)) return str;

    let result = str;

    for (const word of words) {
        if (typeof word !== "string" || !word.length) continue;

        // Build a regex that finds the word only when it appears as a substring
        const regex = new RegExp(word, "gi");

        result = result.replace(regex, match => {
            return match.charAt(0).toUpperCase() + match.slice(1);
        });
    }

    return result;
}