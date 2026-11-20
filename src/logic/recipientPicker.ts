import { suggestOptions } from '@dloizides/ui-forms';

import { badAddresses, parseAddresses } from './addresses';

import type { AddressCheck } from './addresses';
import type { ControlOption } from '@dloizides/ui-forms';

export interface RecipientPerson {
  name: string;
  email: string;
}

export interface RecipientBoxes {
  to: string;
  cc: string;
}

export interface OwnAddress {
  address: string;
  label: string;
}

const LIST_JOIN = ', ';
const WHITESPACE = /\s+/;
const MIN_TYPED = 1;
const MAX_SUGGESTIONS = 8;

function typedPart(box: string, isValid: AddressCheck): string {
  const tail = box.slice(Math.max(box.lastIndexOf(','), box.lastIndexOf(';')) + 1);
  const finished = tail.split(WHITESPACE).filter(isValid).at(-1);
  const typedFrom = finished === undefined ? 0 : tail.lastIndexOf(finished) + finished.length;
  return tail.slice(typedFrom).trimStart();
}

function sameAddress(left: string, right: string): boolean {
  return left.toLowerCase() === right.toLowerCase();
}

function ownChoice(people: readonly RecipientPerson[], own: OwnAddress): ControlOption[] {
  const isSaved = people.some((person) => sameAddress(person.email, own.address));
  return own.address === '' || isSaved ? [] : [{ label: own.label, value: own.address, detail: own.address }];
}

/** The saved people and our own address, minus every address already in To or Cc. */
export function recipientChoices(
  people: readonly RecipientPerson[],
  own: OwnAddress,
  boxes: RecipientBoxes
): ControlOption[] {
  const inBoxes = parseAddresses(`${boxes.to} ${boxes.cc}`);
  const saved = people.map((person) => ({ label: person.name, value: person.email, detail: person.email }));
  return [...saved, ...ownChoice(people, own)].filter(
    (choice) => !inBoxes.some((address) => sameAddress(address, choice.value))
  );
}

/** Appends an address to a box and keeps the addresses already there. */
export function addAddress(box: string, address: string): string {
  return [...parseAddresses(box), address].join(LIST_JOIN);
}

/** Swaps the address being typed at the end of a box for a finished one. */
export function completeAddress(box: string, address: string, isValid: AddressCheck): string {
  return `${box.slice(0, box.length - typedPart(box, isValid).length)}${address}`;
}

/** The choices matching the address being typed at the end of a box, by name or address. */
export function matchingChoices(
  choices: readonly ControlOption[],
  box: string,
  isValid: AddressCheck
): readonly ControlOption[] {
  return suggestOptions(choices, typedPart(box, isValid), MIN_TYPED, MAX_SUGGESTIONS);
}

/** Whether the only unfinished text in To and Cc is a part that still has suggestions to choose from. */
export function isStillChoosing(
  boxes: RecipientBoxes,
  choices: readonly ControlOption[],
  isValid: AddressCheck
): boolean {
  const all = [boxes.to, boxes.cc];
  const hasSuggestions = (box: string): boolean => matchingChoices(choices, box, isValid).length > 0;
  const settled = all.map((box) =>
    hasSuggestions(box) ? box.slice(0, box.length - typedPart(box, isValid).length) : box
  );
  return all.some(hasSuggestions) && badAddresses(settled.join(' '), isValid).length === 0;
}
