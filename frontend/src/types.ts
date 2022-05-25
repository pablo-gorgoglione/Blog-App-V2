export interface User {
  username: string;
  id: number;
  token: string;
}

interface BaseState {
  loading: boolean;
  error: string;
}

export interface UserState extends BaseState {
  user: User;
}
export interface PostsState extends BaseState {
  posts: PostCard[];
}

export interface PostState extends BaseState {
  post: Post;
}

export interface RegisterUserForm extends Omit<User, 'id' | 'token'> {
  password: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  likes: string[];
}

export interface PostForm {
  title: string;
  content: string;
  tags: string[];
}

export interface Post extends PostForm {
  id: string;
  createdAt: string;
  likes: Like[];
  comments: Comment[];
  likeCounter: number;
  commentCounter: number;
}

export interface Like {
  id: string;
  userid: string;
  postId: string;
  commentId?: string;
}

export interface PostCard {
  id: string;
  title: string;
  content: string;
  likeCounter: number;
  commentCounter: number;
  tags: string[];
}
