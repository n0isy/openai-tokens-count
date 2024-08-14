export const longSideLimit = 2048;
export const shortSideLimit = 768;
export const tileSize = 512;

const defaultFixedPrice = 85;
const defaultTilePrice = 170;

const customFixedPrices = new Map ([
  ['gpt-4o-mini',  2833],
]);

export const getFixedPrice = (chatModel: string) => {
  return customFixedPrices.get(chatModel) ?? defaultFixedPrice;
}

const customTilePrices = new Map ([
  ['gpt-4o-mini',  5667],
]);

export const getTilePrice = (chatModel: string) => {
  return customTilePrices.get(chatModel) ?? defaultTilePrice;
}
