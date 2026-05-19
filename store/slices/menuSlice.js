import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [
    {
      id: "item-1",
      name: "Biryani",
      category: "mains",
      price: 200,
      image: "https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Fragrant basmati rice with meat",
      available: true,
      popular: true,
    },
    {
      id: "item-2",
      name: "Butter Chicken",
      category: "mains",
      price: 180,
      image: "https://images.pexels.com/photos/8949920/pexels-photo-8949920.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Tender chicken in creamy tomato sauce",
      available: true,
      popular: true,
    },
    {
      id: "item-3",
      name: "Paneer Tikka",
      category: "starters",
      price: 140,
      image: "https://images.pexels.com/photos/5737489/pexels-photo-5737489.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Grilled paneer pieces with spices",
      available: true,
      popular: false,
    },
    {
      id: "item-4",
      name: "Naan Bread",
      category: "breads",
      price: 40,
      image: "https://images.pexels.com/photos/5559881/pexels-photo-5559881.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Traditional Indian flatbread",
      available: true,
      popular: true,
    },
    {
      id: "item-5",
      name: "Gulab Jamun",
      category: "desserts",
      price: 80,
      image: "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Sweet milk solids in sugar syrup",
      available: true,
      popular: false,
    },
  ],
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    toggleItemAvailability(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.available = !item.available;
      }
    },

    updateItemPrice(state, action) {
      const { itemId, price } = action.payload;
      const item = state.items.find((i) => i.id === itemId);
      if (item) {
        item.price = price;
      }
    },

    addMenuItem(state, action) {
      state.items.push(action.payload);
    },

    removeMenuItem(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});

export const { toggleItemAvailability, updateItemPrice, addMenuItem, removeMenuItem } =
  menuSlice.actions;

export const selectAllMenuItems = (state) => state.menu.items;

export const selectAvailableItems = (state) =>
  state.menu.items.filter((i) => i.available);

export const selectItemsByCategory = (state, category) =>
  state.menu.items.filter((i) => i.category === category && i.available);

export const selectMenuItemById = (state, itemId) =>
  state.menu.items.find((i) => i.id === itemId);

export default menuSlice.reducer;
