import { useEffect, useReducer } from 'react';
import { postApi } from '../api/api';
import { Post, PostState } from '../types';

export type PostReducerAction =
  | { type: 'SET_POST'; payload: Post }
  | { type: 'SET_LOADING' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET' };

const postReducer = (
  state: PostState,
  action: PostReducerAction
): PostState => {
  switch (action.type) {
    case 'SET_POST':
      return {
        error: '',
        loading: false,
        post: action.payload,
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
        post: {} as Post,
      };
  }
};

const INITIAL_STATE: PostState = {
  loading: false,
  error: '',
  post: {} as Post,
};

const usePost = (id: string) => {
  const [state, dispatch] = useReducer(postReducer, INITIAL_STATE);
  const { error, loading, post } = state;

  useEffect(() => {
    const getPost = async () => {
      dispatch({ type: 'SET_LOADING' });
      const res = await postApi.getOne(id);
      console.log(res);
      dispatch({ type: 'SET_POST', payload: res });
    };
    getPost().catch((e) => console.log(e));
  }, [id]);

  return { error, loading, post };
};

export default usePost;
