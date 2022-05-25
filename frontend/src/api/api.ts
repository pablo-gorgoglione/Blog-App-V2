import axios from 'axios';
import { Post, PostCard, RegisterUserForm, User } from '../types';

const http = axios.create({
  headers: {
    'Content-type': 'application/json',
  },
});

const apiUrl = 'http://localhost:4500/api';
const userEndPoint = `${apiUrl}/users`;
const postsEndPoint = `${apiUrl}/posts`;

export const userApi = {
  login: async (username: string, password: string): Promise<User> => {
    const res = await http.post(`${userEndPoint}/login`, {
      username,
      password,
    });
    return res.data;
  },
  register: async (user: RegisterUserForm): Promise<User> => {
    const res = await http.post(`${userEndPoint}/`, user);
    return res.data;
  },
};

export const postApi = {
  getOne: async (id: string): Promise<Post> => {
    const res = await http.get(`${postsEndPoint}/${id}`);
    return res.data;
  },
  getAll: async (): Promise<PostCard[]> => {
    const res = await http.get(`${postsEndPoint}?page=1&limit=25`);
    return res.data.results;
  },
  post: async (post: Post, token: string): Promise<Post> => {
    const res = await http.post(
      `${postsEndPoint}/`,
      { post },
      { headers: { Authorization: token } }
    );
    return res.data;
  },
  postLike: async (id: string): Promise<Post> => {
    const res = await http.post(`${postsEndPoint}/${id}/like`);
    return res.data;
  },
  deleteLike: async (id: string): Promise<Post> => {
    const res = await http.delete(`${postsEndPoint}/${id}/like`);
    return res.data;
  },
};

export const commentApi = {
  post: async (id: string, content: string): Promise<Comment> => {
    const res = await http.post(`${postsEndPoint}/${id}/comments`);
    return res.data;
  },
  delete: async (id: string, commentId: string): Promise<Comment> => {
    const res = await http.delete(
      `${postsEndPoint}/${id}/comments/${commentId}`
    );
    return res.data;
  },
  postLike: async (id: string, commentId: string): Promise<Post> => {
    const res = await http.post(
      `${postsEndPoint}/${id}/comments/${commentId}/like`
    );
    return res.data;
  },
  deleteLike: async (id: string, commentId: string): Promise<Post> => {
    const res = await http.delete(
      `${postsEndPoint}/${id}/comments/${commentId}/like`
    );
    return res.data;
  },
};
