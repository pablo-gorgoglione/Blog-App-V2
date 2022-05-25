import { PostCard, PostsState } from '../../types';

export type PostsReducerAction =
  | { type: 'SET_POSTS'; payload: PostCard[] }
  | { type: 'SET_LOADING' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET' };

const postsReducer = (
  state: PostsState,
  action: PostsReducerAction
): PostsState => {
  switch (action.type) {
    case 'SET_POSTS':
      return {
        error: '',
        loading: false,
        posts: action.payload,
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
        posts: [],
      };
  }
};
export default postsReducer;
