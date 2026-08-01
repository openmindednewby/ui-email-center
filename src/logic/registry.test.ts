import { EmailFieldKind } from '../model/EmailFieldKind';
import type { EmailCategory, EmailKind } from '../model/types';

import { createEmailRegistry } from './registry';

const categories: EmailCategory[] = [
  { id: 'transactional', titleI18nKey: 'c.tx', order: 1 },
  { id: 'access', titleI18nKey: 'c.access', order: 2 },
];

const kind = (id: string, category: string): EmailKind => ({
  id,
  category,
  titleI18nKey: `k.${id}`,
  descriptionI18nKey: `k.${id}.d`,
  fields: [{ key: 'name', labelI18nKey: 'l', kind: EmailFieldKind.Text, sample: 's' }],
  defaultContent: { subject: 's', heading: 'h', bodyBlocks: ['b'] },
});

describe('createEmailRegistry', () => {
  it('exposes categories and kinds as registered', () => {
    const registry = createEmailRegistry(categories, [kind('a', 'transactional')]);
    expect(registry.categories()).toHaveLength(2);
    expect(registry.kinds()).toHaveLength(1);
  });

  it('groups kinds under ordered categories', () => {
    const registry = createEmailRegistry(categories, [
      kind('reset', 'access'),
      kind('confirm', 'transactional'),
    ]);
    expect(registry.groups().map((group) => group.category.id)).toEqual([
      'transactional',
      'access',
    ]);
  });

  it('looks up a kind by id', () => {
    const registry = createEmailRegistry(categories, [kind('confirm', 'transactional')]);
    expect(registry.kind('confirm')?.id).toBe('confirm');
    expect(registry.kind('nope')).toBeUndefined();
  });

  it('reports orphan kinds', () => {
    const registry = createEmailRegistry(categories, [kind('bad', 'ghost')]);
    expect(registry.orphanKindIds()).toEqual(['bad']);
  });

  it('throws on a duplicate kind id (no silent shadowing)', () => {
    expect(() =>
      createEmailRegistry(categories, [kind('dup', 'transactional'), kind('dup', 'access')]),
    ).toThrow(/duplicate email kind id "dup"/);
  });
});
