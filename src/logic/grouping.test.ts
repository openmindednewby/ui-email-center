import { EmailFieldKind } from '../model/EmailFieldKind';
import type { EmailCategory, EmailKind } from '../model/types';

import { findOrphanKindIds, groupKindsByCategory } from './grouping';

const cat = (id: string, order: number): EmailCategory => ({
  id,
  titleI18nKey: `cat.${id}`,
  order,
});

const kind = (id: string, category: string): EmailKind => ({
  id,
  category,
  titleI18nKey: `k.${id}`,
  descriptionI18nKey: `k.${id}.desc`,
  fields: [{ key: 'name', labelI18nKey: 'l', kind: EmailFieldKind.Text, sample: 's' }],
  defaultContent: { subject: 's', heading: 'h', bodyBlocks: ['b'] },
});

describe('groupKindsByCategory', () => {
  it('orders categories by order then id', () => {
    const categories = [cat('z', 2), cat('a', 1), cat('m', 1)];
    const kinds = [kind('k1', 'z'), kind('k2', 'a'), kind('k3', 'm')];
    const result = groupKindsByCategory(categories, kinds);
    expect(result.map((group) => group.category.id)).toEqual(['a', 'm', 'z']);
  });

  it('keeps kind registration order within a category', () => {
    const categories = [cat('c', 1)];
    const kinds = [kind('k2', 'c'), kind('k1', 'c')];
    const result = groupKindsByCategory(categories, kinds);
    expect(result[0]?.kinds.map((k) => k.id)).toEqual(['k2', 'k1']);
  });

  it('omits empty categories', () => {
    const categories = [cat('full', 1), cat('empty', 2)];
    const kinds = [kind('k1', 'full')];
    const result = groupKindsByCategory(categories, kinds);
    expect(result.map((group) => group.category.id)).toEqual(['full']);
  });

  it('drops a kind whose category is unregistered', () => {
    const categories = [cat('c', 1)];
    const kinds = [kind('k1', 'c'), kind('k2', 'ghost')];
    const result = groupKindsByCategory(categories, kinds);
    expect(result.flatMap((group) => group.kinds.map((k) => k.id))).toEqual(['k1']);
  });

  it('does not mutate the input categories array', () => {
    const categories = [cat('b', 2), cat('a', 1)];
    groupKindsByCategory(categories, []);
    expect(categories.map((c) => c.id)).toEqual(['b', 'a']);
  });
});

describe('findOrphanKindIds', () => {
  it('reports kinds whose category is not registered', () => {
    const categories = [cat('c', 1)];
    const kinds = [kind('ok', 'c'), kind('bad', 'ghost')];
    expect(findOrphanKindIds(categories, kinds)).toEqual(['bad']);
  });

  it('returns an empty array when all categories are registered', () => {
    const categories = [cat('c', 1)];
    expect(findOrphanKindIds(categories, [kind('ok', 'c')])).toEqual([]);
  });
});
