
export type SubtypeMetadata = {
  /** The registered document subtype in system.json. */
  type: string;
  /** A FontAwesome icon that can be added to `typeIcons`, e.g. `"fa-solid fa-user"`. */
  icon?: string;
  /** Record of document names of pseudo-documents and the path to the collection. */
  embedded: Record<string, string>;
};