import { types, UserStore } from './types';

function reducer(state: UserStore, action: any): UserStore {
  switch (action.type) {
    case types.MESSAGE:
      return {
        ...state,
        message: action.payload,
      };
    case types.TOAST_LOADING:
      return {
        ...state,
        toastLoading: action.payload,
      };
    default:
      return state;
  }
}

export default reducer;
