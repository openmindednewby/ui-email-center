import type { EmailCategory, EmailCategoryGroup, EmailKind } from '../model/types';

/**
 * Group kinds under their categories (the taxonomy view).
 *
 * - Categories are ordered by their `order` field (ascending), ties broken by `id` for stability.
 * - Kinds keep their registration order within a category.
 * - A kind whose `category` matches no registered category is dropped from the grouped view (it is
 *   an unregistered-category bug on the app side; grouping stays total rather than inventing a bucket).
 * - Empty categories are OMITTED so the list never shows a header with nothing under it.
 */
export function groupKindsByCategory(
  categories: EmailCategory[],
  kinds: EmailKind[],
): EmailCategoryGroup[] {
  const sorted = [...categories].sort(compareCategories);
  const groups: EmailCategoryGroup[] = [];
  for (const category of sorted) {
    const categoryKinds = kinds.filter((kind) => kind.category === category.id);
    if (categoryKinds.length > 0) {
      groups.push({ category, kinds: categoryKinds });
    }
  }
  return groups;
}

/** Ids of kinds whose category is not registered — surfaced so the app can fix its registration. */
export function findOrphanKindIds(categories: EmailCategory[], kinds: EmailKind[]): string[] {
  const known = new Set(categories.map((category) => category.id));
  return kinds.filter((kind) => !known.has(kind.category)).map((kind) => kind.id);
}

function compareCategories(a: EmailCategory, b: EmailCategory): number {
  if (a.order !== b.order) {
    return a.order - b.order;
  }
  return a.id.localeCompare(b.id);
}
