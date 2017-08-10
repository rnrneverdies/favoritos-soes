import { createStore } from 'redux';
import { combineReducers } from 'redux';

const user = (state = {}, payload) => {
    switch (payload.type) {
        case 'set_user_id':
            return { ...state, id: payload.id };
        default:
            return state;
    }
}

const cart = (state = [], payload) => {
    switch (payload.type) {
        case 'add':
            return [...state, payload.item];
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    user,
    cart,
});

export const Store = (initialState) => {
    return createStore(rootReducer, initialState);
};

export const setUserId = (id) => {
  console.log('setting user id:', id);
  return {
      type: 'set_user_id',
      id
  };
}

