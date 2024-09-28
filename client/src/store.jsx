// src/store.js
import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  counter: 0,
};

// Slice reducer
const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, counter: state.counter + 1 };
    case 'DECREMENT':
      return { ...state, counter: state.counter - 1 };
    default:
      return state;
  }
};

// Configure store
const store = configureStore({
  reducer: counterReducer,
});

export default store;
