export const SERVING_GROUPS = [
  { id: "starters", label: "Starters", emoji: "🥗", hint: "Begin your meal" },
  { id: "mains", label: "Main Course", emoji: "🍛", hint: "Hearty dishes" },
  { id: "breads", label: "Breads & Rice", emoji: "🫓", hint: "On the side" },
  { id: "desserts", label: "Desserts", emoji: "🍨", hint: "Sweet finish" },
  { id: "drinks", label: "Drinks", emoji: "🥤", hint: "Refreshments" },
];

export const RESTAURANTS = [
  {
    id: "spice-garden",
    name: "Spice Garden",
    cuisine: "North Indian · Mughlai",
    rating: 4.6,
    eta: "25-35 min",
    distance: "1.2 km",
    cover: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["Popular", "Dine-in"],
  },
  {
    id: "coastal-catch",
    name: "Coastal Catch",
    cuisine: "Seafood · Goan",
    rating: 4.4,
    eta: "30-40 min",
    distance: "2.5 km",
    cover: "https://images.pexels.com/photos/2608047/pexels-photo-2608047.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["New", "Takeaway"],
  },
  {
    id: "wok-house",
    name: "Wok House",
    cuisine: "Chinese · Thai",
    rating: 4.3,
    eta: "20-30 min",
    distance: "0.8 km",
    cover: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=800",
    tags: ["Fast", "Dine-in"],
  },
];

const MENU_DATA = {
  "spice-garden": [
    { id: "sg-1", name: "Paneer Tikka", price: 280, group: "starters", veg: true, popular: true, spicy: true, description: "Marinated cottage cheese grilled in tandoor", image: "https://images.pexels.com/photos/3850832/pexels-photo-3850832.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "sg-2", name: "Chicken Seekh Kebab", price: 320, group: "starters", veg: false, popular: true, spicy: false, description: "Minced chicken kebabs with aromatic spices", image: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "sg-3", name: "Tomato Soup", price: 150, group: "starters", veg: true, popular: false, spicy: false, description: "Creamy tomato shorba with croutons", image: "https://images.pexels.com/photos/539434/pexels-photo-539434.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "sg-4", name: "Butter Chicken", price: 380, group: "mains", veg: false, popular: true, spicy: false, description: "Tender chicken in rich tomato-butter gravy", image: "https://images.pexels.com/photos/4754789/pexels-photo-4754789.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "sg-5", name: "Dal Makhani", price: 260, group: "mains", veg: true, popular: true, spicy: false, description: "Slow-cooked black lentils with cream", image: "https://images.pexels.com/photos/3349350/pexels-photo-3349350.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "sg-6", name: "Paneer Butter Masala", price: 320, group: "mains", veg: true, popular: false, spicy: true, description: "Cottage cheese in creamy tomato sauce", image: "https://images.pexels.com/photos/3850832/pexels-photo-3850832.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "sg-7", name: "Garlic Naan", price: 80, group: "breads", veg: true, popular: true, spicy: false, description: "Soft naan with garlic and butter", image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "sg-8", name: "Jeera Rice", price: 180, group: "breads", veg: true, popular: false, spicy: false, description: "Fragrant basmati rice with cumin", image: "https://images.pexels.com/photos/5404466/pexels-photo-5404466.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "sg-9", name: "Gulab Jamun", price: 160, group: "desserts", veg: true, popular: true, spicy: false, description: "Deep-fried milk dumplings in sugar syrup", image: "https://images.pexels.com/photos/539434/pexels-photo-539434.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "sg-10", name: "Kulfi", price: 140, group: "desserts", veg: true, popular: false, spicy: false, description: "Traditional Indian ice cream with pistachios", image: "https://images.pexels.com/photos/3850832/pexels-photo-3850832.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "sg-11", name: "Mango Lassi", price: 120, group: "drinks", veg: true, popular: true, spicy: false, description: "Chilled mango yogurt drink", image: "https://images.pexels.com/photos/5404466/pexels-photo-5404466.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "sg-12", name: "Masala Chai", price: 60, group: "drinks", veg: true, popular: false, spicy: true, description: "Spiced Indian tea with ginger", image: "https://images.pexels.com/photos/539434/pexels-photo-539434.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ],
  "coastal-catch": [
    { id: "cc-1", name: "Prawn Fry", price: 380, group: "starters", veg: false, popular: true, spicy: true, description: "Crispy fried prawns with Goan spices", image: "https://images.pexels.com/photos/3850832/pexels-photo-3850832.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "cc-2", name: "Fish Curry Rice", price: 350, group: "mains", veg: false, popular: true, spicy: true, description: "Goan fish curry with steamed rice", image: "https://images.pexels.com/photos/4754789/pexels-photo-4754789.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "cc-3", name: "Sorpotel", price: 320, group: "mains", veg: false, popular: false, spicy: true, description: "Traditional Goan pork stew", image: "https://images.pexels.com/photos/3349350/pexels-photo-3349350.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "cc-4", name: "Bebinca", price: 200, group: "desserts", veg: true, popular: true, spicy: false, description: "Layered Goan coconut cake", image: "https://images.pexels.com/photos/539434/pexels-photo-539434.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ],
  "wok-house": [
    { id: "wh-1", name: "Spring Rolls", price: 220, group: "starters", veg: true, popular: true, spicy: false, description: "Crispy vegetable spring rolls with dipping sauce", image: "https://images.pexels.com/photos/3850832/pexels-photo-3850832.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "wh-2", name: "Kung Pao Chicken", price: 340, group: "mains", veg: false, popular: true, spicy: true, description: "Spicy stir-fried chicken with peanuts", image: "https://images.pexels.com/photos/4754789/pexels-photo-4754789.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "wh-3", name: "Veg Fried Rice", price: 240, group: "mains", veg: true, popular: false, spicy: false, description: "Wok-tossed rice with vegetables", image: "https://images.pexels.com/photos/5404466/pexels-photo-5404466.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { id: "wh-4", name: "Mango Sticky Rice", price: 180, group: "desserts", veg: true, popular: true, spicy: false, description: "Thai dessert with fresh mango and coconut", image: "https://images.pexels.com/photos/539434/pexels-photo-539434.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ],
};

export function getRestaurant(id) {
  return RESTAURANTS.find((r) => r.id === id) || null;
}

export function getMenu(id) {
  return MENU_DATA[id] || [];
}
