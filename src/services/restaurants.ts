// Mock data layer. Swap with a real API later — keep shapes stable.

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  eta: string;
  distance: string;
  cover: string;
  tags: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  group: ServingGroup;
  veg: boolean;
  spicy?: boolean;
  popular?: boolean;
}

export type ServingGroup = "starters" | "mains" | "desserts" | "drinks";

export const SERVING_GROUPS: { id: ServingGroup; label: string; emoji: string; hint: string }[] = [
  { id: "starters", label: "Starters", emoji: "🥗", hint: "Served first" },
  { id: "mains", label: "Mains", emoji: "🍛", hint: "After starters" },
  { id: "desserts", label: "Desserts", emoji: "🍰", hint: "After mains" },
  { id: "drinks", label: "Drinks", emoji: "🥤", hint: "Anytime" },
];

const img = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=600&q=70`;

export const RESTAURANTS: Restaurant[] = [
  {
    id: "r1", name: "Saffron House", cuisine: "North Indian · Mughlai",
    rating: 4.7, eta: "20–30 min", distance: "0.4 km",
    cover: img("1565958011703-44f9829ba187"),
    tags: ["Live counter", "Bar", "Family"],
  },
  {
    id: "r2", name: "Tokyo Lane", cuisine: "Japanese · Sushi",
    rating: 4.8, eta: "25–35 min", distance: "1.2 km",
    cover: img("1579871494447-9811cf80d66c"),
    tags: ["Omakase", "Sake"],
  },
  {
    id: "r3", name: "Forno", cuisine: "Italian · Wood-fired",
    rating: 4.6, eta: "15–25 min", distance: "0.8 km",
    cover: img("1513104890138-7c749659a591"),
    tags: ["Pizza", "Vegan options"],
  },
  {
    id: "r4", name: "Coast & Coal", cuisine: "Coastal · Seafood",
    rating: 4.5, eta: "30–40 min", distance: "2.1 km",
    cover: img("1559339352-11d035aa65de"),
    tags: ["Grills", "Cocktails"],
  },
];

export const MENU: Record<string, MenuItem[]> = {
  r1: [
    { id: "m1", name: "Tandoori Paneer Tikka", description: "Smoky cottage cheese, charred peppers, mint chutney.", price: 320, image: img("1565557623262-b51c2513a641"), group: "starters", veg: true, popular: true },
    { id: "m2", name: "Galouti Kebab", description: "Melt-in-mouth lamb patties, saffron foam, ulte tawa parathas.", price: 480, image: img("1567188040759-fb8a883dc6d8"), group: "starters", veg: false, spicy: true },
    { id: "m3", name: "Butter Chicken", description: "Tandoor-charred chicken in silky tomato-cream gravy.", price: 540, image: img("1603894584373-5ac82b2ae398"), group: "mains", veg: false, popular: true },
    { id: "m4", name: "Dal Makhani", description: "Slow-cooked black lentils, finished with cream and butter.", price: 380, image: img("1546833999-b9f581a1996d"), group: "mains", veg: true },
    { id: "m5", name: "Saffron Kulfi", description: "Reduced milk, pistachio, saffron threads, edible silver.", price: 220, image: img("1488477181946-6428a0291777"), group: "desserts", veg: true },
    { id: "m6", name: "Masala Chai", description: "Assam tea, cardamom, ginger, jaggery.", price: 90, image: img("1597318236008-95e2c2c2ad2f"), group: "drinks", veg: true },
    { id: "m7", name: "Mango Lassi", description: "Alphonso pulp, hung curd, a pinch of cardamom.", price: 160, image: img("1571805341302-f857fa4c1bb1"), group: "drinks", veg: true, popular: true },
  ],
  r2: [
    { id: "m8", name: "Edamame", description: "Steamed, smoked salt.", price: 260, image: img("1564834744159-ff0ea41ba4b9"), group: "starters", veg: true },
    { id: "m9", name: "Salmon Nigiri (4 pc)", description: "Norwegian salmon, vinegared rice.", price: 540, image: img("1579871494447-9811cf80d66c"), group: "mains", veg: false, popular: true },
    { id: "m10", name: "Mochi Trio", description: "Matcha, yuzu, black sesame.", price: 320, image: img("1564834744159-ff0ea41ba4b9"), group: "desserts", veg: true },
    { id: "m11", name: "Sencha", description: "Hot Japanese green tea.", price: 180, image: img("1597318236008-95e2c2c2ad2f"), group: "drinks", veg: true },
  ],
  r3: [
    { id: "m12", name: "Bruschetta Pomodoro", description: "Sourdough, heirloom tomato, basil.", price: 290, image: img("1572441713132-c542fc4fe282"), group: "starters", veg: true },
    { id: "m13", name: "Margherita D.O.P.", description: "San Marzano, fior di latte, basil.", price: 520, image: img("1513104890138-7c749659a591"), group: "mains", veg: true, popular: true },
    { id: "m14", name: "Tiramisu", description: "Mascarpone, espresso-soaked savoiardi.", price: 340, image: img("1571877227200-a0d98ea607e9"), group: "desserts", veg: true },
    { id: "m15", name: "Espresso", description: "Single origin, double shot.", price: 140, image: img("1497935586351-b67a49e012bf"), group: "drinks", veg: true },
  ],
  r4: [
    { id: "m16", name: "Prawn Koliwada", description: "Crisp-fried prawns, kokum mayo.", price: 480, image: img("1559339352-11d035aa65de"), group: "starters", veg: false, spicy: true },
    { id: "m17", name: "Goan Fish Curry", description: "Day's catch, coconut, kokum, steamed rice.", price: 640, image: img("1546833999-b9f581a1996d"), group: "mains", veg: false, popular: true },
    { id: "m18", name: "Bebinca", description: "Seven-layer Goan dessert, jaggery, ghee.", price: 280, image: img("1488477181946-6428a0291777"), group: "desserts", veg: true },
    { id: "m19", name: "Sol Kadhi", description: "Kokum, coconut milk, green chili.", price: 120, image: img("1571805341302-f857fa4c1bb1"), group: "drinks", veg: true },
  ],
};

export function getRestaurant(id: string) {
  return RESTAURANTS.find((r) => r.id === id);
}
export function getMenu(id: string) {
  return MENU[id] ?? [];
}
