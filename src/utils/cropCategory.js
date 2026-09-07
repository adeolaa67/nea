// Keyword list of crops that are colloquially called "fruit" (not strictly
// botanical - tomatoes etc. stay "Vegetables" to match how a home grower
// would file them) - used only for the category pill on each crop card.
const FRUIT_KEYWORDS = [
  'apple', 'banana', 'plantain', 'grape', 'watermelon', 'melon', 'cantaloupe',
  'honeydew', 'orange', 'tangerine', 'citron', 'kumquat', 'lemon', 'lime',
  'pineapple', 'mango', 'coconut', 'kiwi', 'cherry', 'peach', 'nectarine',
  'pear', 'strawberry', 'blueberry', 'huckleberry', 'bilberry', 'raspberry',
  'blackberry', 'boysenberry', 'dewberry', 'cloudberry', 'gooseberry',
  'currant', 'elderberry', 'fig', 'olive', 'guava', 'papaya', 'dragon fruit',
  'passionfruit', 'lychee', 'longan', 'rambutan', 'durian', 'jackfruit',
  'persimmon', 'quince', 'pomegranate', 'star fruit', 'carambola', 'apricot'
];

export function getCropCategory(name) {
  if (!name) return 'Vegetables';
  const lower = name.toLowerCase();
  return FRUIT_KEYWORDS.some((kw) => lower.includes(kw)) ? 'Fruits' : 'Vegetables';
}
