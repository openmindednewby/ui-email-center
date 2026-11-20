import { badAddresses, parseAddresses } from './addresses';
import {
  addAddress,
  completeAddress,
  isStillChoosing,
  matchingChoices,
  recipientChoices,
} from './recipientPicker';

const ME = 'me@example.test';
const ACCOUNTS = 'accounts@example.test';
const PICKED = 'picked@example.test';
const MANAGER = 'manager@example.test';
const OWN_LABEL = 'My own address';
const isEmail = (address: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address);

describe('parseAddresses', () => {
  it('with commas, semicolons, spaces and blanks, returns only the addresses', () => {
    const text = ` ${ACCOUNTS}, ;${MANAGER} , `;

    const addresses = parseAddresses(text);

    expect(addresses).toEqual([ACCOUNTS, MANAGER]);
  });

  it('with an empty box, returns none', () => {
    const text = '   ';

    const addresses = parseAddresses(text);

    expect(addresses).toEqual([]);
  });
});

describe('badAddresses', () => {
  it('with one invalid address among valid ones, returns only the invalid one', () => {
    const text = `${ACCOUNTS}, zzz; ${MANAGER}`;

    const bad = badAddresses(text, isEmail);

    expect(bad).toEqual(['zzz']);
  });
});

describe('recipientChoices', () => {
  const people = [
    { name: 'Accounts', email: ACCOUNTS },
    { name: 'Picked', email: PICKED },
  ];

  it('with an address in either box, leaves it out and offers our own', () => {
    const choices = recipientChoices(people, { address: ME, label: OWN_LABEL }, { to: ACCOUNTS.toUpperCase(), cc: '' });

    expect(choices).toEqual([
      { label: 'Picked', value: PICKED, detail: PICKED },
      { label: OWN_LABEL, value: ME, detail: ME },
    ]);
  });

  it('with our own address saved as a person, offers it once', () => {
    const choices = recipientChoices(people, { address: PICKED, label: OWN_LABEL }, { to: '', cc: '' });

    expect(choices.map((choice) => choice.value)).toEqual([ACCOUNTS, PICKED]);
  });

  it('with no own address, offers only the people', () => {
    const choices = recipientChoices(people, { address: '', label: OWN_LABEL }, { to: '', cc: '' });

    expect(choices.map((choice) => choice.value)).toEqual([ACCOUNTS, PICKED]);
  });
});

describe('addAddress', () => {
  it('with addresses in the box, keeps them and appends the pick', () => {
    const box = addAddress(`${ACCOUNTS},`, PICKED);

    expect(box).toBe(`${ACCOUNTS}, ${PICKED}`);
  });
});

describe('completeAddress', () => {
  it.each([
    ['a partial last address', `${ACCOUNTS}, pic`, `${ACCOUNTS}, ${PICKED}`],
    ['two words after a comma', `${ACCOUNTS}, Popi T`, `${ACCOUNTS}, ${PICKED}`],
    ['two words after a finished address and no comma', `${ACCOUNTS} Popi T`, `${ACCOUNTS} ${PICKED}`],
    ['only a name in the box', 'Popi T', PICKED],
  ])('with %s, replaces only the typed part', (_scenario, typed, expected) => {
    const box = completeAddress(typed, PICKED, isEmail);

    expect(box).toBe(expected);
  });
});

describe('matchingChoices', () => {
  const choices = [{ label: 'Popi Terzidou', value: PICKED, detail: PICKED }];

  it('with part of a name after an earlier address, finds the person', () => {
    const found = matchingChoices(choices, `${ACCOUNTS}, Terz`, isEmail);

    expect(found).toEqual(choices);
  });

  it('with two typed words, searches both, not only the last', () => {
    const tom = { label: 'Tom', value: ME, detail: ME };

    const found = matchingChoices([...choices, tom], `${ACCOUNTS}, Popi T`, isEmail);

    expect(found).toEqual(choices);
  });

  it('with a finished address and a separator, suggests nothing', () => {
    const found = matchingChoices(choices, 'popi@example.test, ', isEmail);

    expect(found).toEqual([]);
  });
});

describe('isStillChoosing', () => {
  const choices = [{ label: 'Popi Picked', value: PICKED, detail: PICKED }];

  it('with a typed name that has suggestions, returns true', () => {
    const boxes = { to: `${ACCOUNTS}, Pop`, cc: '' };

    const choosing = isStillChoosing(boxes, choices, isEmail);

    expect(choosing).toBe(true);
  });

  it.each([
    ['a typed word nobody matches', { to: 'zzz', cc: '' }],
    ['a bad address before the typed name', { to: 'zzz, Pop', cc: '' }],
    ['a bad address in the other box', { to: 'Pop', cc: 'zzz' }],
    ['only finished addresses', { to: ACCOUNTS, cc: '' }],
  ])('with %s, returns false', (_scenario, boxes) => {
    const choosing = isStillChoosing(boxes, choices, isEmail);

    expect(choosing).toBe(false);
  });
});
