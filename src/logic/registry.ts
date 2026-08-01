import type { EmailCategory, EmailCategoryGroup, EmailKind } from '../model/types';

import { findOrphanKindIds, groupKindsByCategory } from './grouping';

/** The read model each product builds once and hands to `<EmailCenter>`. */
export interface EmailRegistry {
  categories(): EmailCategory[];
  kinds(): EmailKind[];
  /** Categories with their kinds, ordered + empty-omitted (the taxonomy view). */
  groups(): EmailCategoryGroup[];
  /** Look up a single kind by id. */
  kind(id: string): EmailKind | undefined;
  /** Ids of kinds registered under an unknown category (a registration bug to fix). */
  orphanKindIds(): string[];
}

/**
 * Create a product's email registry from its categories + kinds.
 *
 * Pure + framework-free: a product defines its taxonomy once and passes the registry's
 * `categories()`/`kinds()` into the shared `<EmailCenter>`. Duplicate kind ids are rejected early
 * so two registrations can never silently shadow one another.
 */
export function createEmailRegistry(
  categories: EmailCategory[],
  kinds: EmailKind[],
): EmailRegistry {
  assertUniqueKindIds(kinds);
  const byId = new Map(kinds.map((kind) => [kind.id, kind]));

  return {
    categories: () => categories,
    kinds: () => kinds,
    groups: () => groupKindsByCategory(categories, kinds),
    kind: (id: string) => byId.get(id),
    orphanKindIds: () => findOrphanKindIds(categories, kinds),
  };
}

function assertUniqueKindIds(kinds: EmailKind[]): void {
  const seen = new Set<string>();
  for (const kind of kinds) {
    if (seen.has(kind.id)) {
      throw new Error(`ui-email-center: duplicate email kind id "${kind.id}"`);
    }
    seen.add(kind.id);
  }
}
