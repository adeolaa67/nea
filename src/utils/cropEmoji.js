// Keyword -> emoji lookup for CropCard headers. plants.csv has no emoji
// column, so this maps common crop-name substrings to a representative
// emoji and falls back to a generic seedling for anything unmatched.
const KEYWORD_EMOJI = [
  [['apple'], '🍎'],
  [['banana', 'plantain'], '🍌'],
  [['grape'], '🍇'],
  [['watermelon'], '🍉'],
  [['melon', 'cantaloupe', 'honeydew'], '🍈'],
  [['orange', 'tangerine', 'citron', 'kumquat'], '🍊'],
  [['lemon'], '🍋'],
  [['lime', 'finger lime'], '🍋'],
  [['pineapple'], '🍍'],
  [['mango'], '🥭'],
  [['coconut'], '🥥'],
  [['kiwi'], '🥝'],
  [['cherry'], '🍒'],
  [['peach', 'nectarine'], '🍑'],
  [['pear'], '🍐'],
  [['strawberry'], '🍓'],
  [['blueberry', 'huckleberry', 'bilberry'], '🫐'],
  [['tomato', 'tomatillo'], '🍅'],
  [['eggplant'], '🍆'],
  [['avocado'], '🥑'],
  [['potato'], '🥔'],
  [['sweet potato', 'yam'], '🍠'],
  [['carrot'], '🥕'],
  [['corn'], '🌽'],
  [['pepper', 'chili', 'aji', 'pimento'], '🌶️'],
  [['cucumber', 'gherkin'], '🥒'],
  [['pickle'], '🥒'],
  [['lettuce', 'kale', 'spinach', 'cabbage', 'chard', 'collards', 'bok choy',
    'pak choi', 'mizuna', 'arugula', 'rocket', 'endive', 'escarole',
    'radicchio', 'watercress', 'cress', 'sorrel', 'mustard green'], '🥬'],
  [['broccoli', 'romanesco'], '🥦'],
  [['garlic'], '🧄'],
  [['onion', 'shallot', 'scallion', 'leek', 'chive'], '🧅'],
  [['mushroom'], '🍄'],
  [['peanut', 'groundnut'], '🥜'],
  [['almond', 'cashew', 'hazelnut', 'macadamia', 'pecan', 'walnut', 'chestnut'], '🌰'],
  [['bean', 'pea', 'lentil', 'chickpea', 'edamame', 'soybean'], '🫘'],
  [['rice'], '🍚'],
  [['wheat', 'teff'], '🌾'],
  [['sugarcane', 'sugar beet'], '🎋'],
  [['coffee'], '☕'],
  [['tea', 'yerba mate'], '🍵'],
  [['fig'], '🫒'],
  [['olive'], '🫒'],
  [['flower', 'nasturtium', 'lavender', 'rose'], '🌸'],
  [['pumpkin', 'squash', 'gourd'], '🎃'],
  [['radish', 'turnip', 'daikon', 'beet', 'parsnip', 'rutabaga', 'swede', 'celeriac'], '🫛'],
  [['basil', 'mint', 'thyme', 'rosemary', 'sage', 'oregano', 'marjoram',
    'parsley', 'cilantro', 'dill', 'tarragon', 'bay leaf', 'catnip',
    'lemongrass', 'lemon balm', 'savory', 'anise', 'borage'], '🌿'],
  [['raspberry', 'blackberry', 'boysenberry', 'dewberry', 'cloudberry',
    'gooseberry', 'currant', 'elderberry'], '🍇'],
  [['fruit', 'guava', 'papaya', 'dragon fruit', 'passionfruit', 'lychee',
    'longan', 'rambutan', 'durian', 'jackfruit', 'persimmon', 'quince',
    'pomegranate', 'star fruit', 'carambola'], '🍈'],
  [['tree', 'wood'], '🌳']
];

export function getCropEmoji(name) {
  if (!name) return '🌱';
  const lower = name.toLowerCase();
  for (const [keywords, emoji] of KEYWORD_EMOJI) {
    if (keywords.some((kw) => lower.includes(kw))) return emoji;
  }
  return '🌱';
}
