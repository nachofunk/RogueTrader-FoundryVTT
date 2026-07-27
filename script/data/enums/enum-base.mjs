const { StringField } = foundry.data.fields;

export class EnumBase {
  static DATA = {};

  static get KEYS() {
    return Object.fromEntries(
      Object.keys(this.DATA).map(k => [k, k])
    );
  }

  /** Override in subclass */
  static DEFAULT = "";

  /** Schema: keys only, no localization, no metadata */
  static schema({ blank = false } = {}) {
    return new StringField({
      initial: this.DEFAULT,
      blank: blank,
      choices: () =>
        Object.fromEntries(
          Object.keys(this.DATA).map(key => [key, key])
        )
    });
  }

  /** UI: localized labels + metadata */
  static options() {
    return Object.fromEntries(
      Object.entries(this.DATA).map(([key, data]) => [
        key,
        {
          ...data,
          label: game.i18n.localize(data.label),
        }
      ])
    );
  }

  /** Numeric or other primary value lookup */
  static value(key) {
    return this.DATA[key];
  }

  /** Localized label lookup */
  static label(key) {
    const entry = this.DATA[key];
    return entry ? game.i18n.localize(entry.label) : key;
  }

  /** Find key by value or by value.short */
  static keyOf(value) {
    if (!value) return null;
    for (const [key, entry] of Object.entries(this.DATA)) {
      if (entry === value) return key;
      if (entry.short === value.short) return key;
    }
    return null;
  }

  /**
   * @template {keyof this["DATA"]} K
   * @template {this["DATA"][K]} V
   * @param {V} value
   * @param {K} key
   */
  static compare(value, key) {
    return this.keyOf(value) === key;
  }

}
