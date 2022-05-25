import { createContext, useReducer } from 'react';
import { userApi } from '../../api/api';
import { RegisterUserForm, User, UserState } from '../../types';
import userReducer from './UserReducer';

interface IUserContext {
  userState: UserState;
  login: (username: string, password: string) => Promise<boolean>;
  register: (user: RegisterUserForm) => void;
}

const UserContext = createContext<IUserContext>({} as IUserContext);

interface props {
  children: JSX.Element | JSX.Element[];
}

const INITIAL_USER: User = {
  username: '',
  id: 0,
  token: '',
};

const INITIAL_STATE: UserState = {
  loading: false,
  error: '',
  user: INITIAL_USER,
};

export const UserProdiver = ({ children }: props) => {
  const [userState, dispatch] = useReducer(userReducer, INITIAL_STATE);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const user = await userApi.login(username, password);
      dispatch({ type: 'SET_USER', payload: user });
      return true;
    } catch (error) {
      console.log(error);
      dispatch({ type: 'SET_ERROR', payload: 'Error trying to login' });
      return false;
    }
  };

  const register = async (user: RegisterUserForm) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await userApi.register(user);
      dispatch({ type: 'SET_USER', payload: res });
    } catch (error) {
      console.log(error);
      dispatch({ type: 'SET_ERROR', payload: 'Error trying to register' });
    }
  };
  return (
    <UserContext.Provider value={{ userState, login, register }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserContext;
