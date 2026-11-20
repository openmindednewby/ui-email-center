export type AddressCheck = (address: string) => boolean;

const ADDRESS_GAPS = /[\s,;]+/;

/** Splits a To or Cc box into its addresses. */
export function parseAddresses(text: string): string[] {
  return text.split(ADDRESS_GAPS).filter((address) => address !== '');
}

/** Lists the addresses in a box that are not valid. */
export function badAddresses(text: string, isValid: AddressCheck): string[] {
  return parseAddresses(text).filter((address) => !isValid(address));
}
