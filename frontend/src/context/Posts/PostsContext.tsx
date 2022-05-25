import { createContext, useEffect, useReducer } from 'react';
import { postApi } from '../../api/api';
import { PostsState } from '../../types';
import postsReducer from './PostsReducer';

interface IPostsContext {
  postsState: PostsState;
  getAll: () => void;
}

const PostsContext = createContext<IPostsContext>({} as IPostsContext);

interface props {
  children: JSX.Element | JSX.Element[];
}

const INITIAL_STATE: PostsState = {
  loading: false,
  error: '',
  posts: [],
};
export const PostsProvider = ({ children }: props) => {
  const [postsState, dispatch] = useReducer(postsReducer, INITIAL_STATE);

  useEffect(() => {
    getAll();
  }, []);

  const getAll = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await postApi.getAll();
      dispatch({ type: 'SET_POSTS', payload: res });
    } catch (error) {
      console.log(error);
      dispatch({ type: 'SET_ERROR', payload: 'Error retriving data' });
    }
  };
  return (
    <PostsContext.Provider value={{ postsState, getAll }}>
      {children}
    </PostsContext.Provider>
  );
};
export default PostsContext;
