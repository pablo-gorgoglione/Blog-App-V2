import { User, UserState } from '../../types';

export type UserReducerAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_LOADING' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET' };

const userReducer = (
  state: UserState,
  action: UserReducerAction
): UserState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        error: '',
        loading: false,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'RESET':
      return {
        loading: false,
        error: '',
        user: {
          id: 0,
          username: '',
          token: '',
        },
      };
  }
};

export default userReducer;
