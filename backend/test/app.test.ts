import supertest from 'supertest';
import { app, server } from '../app';
import Comment from '../models/comment';
import Like from '../models/like';
import Post from '../models/post';
import User from '../models/user';

const api = supertest(app);

const user = {
  username: 'Pablo',
  password: '12345',
};

const post = {
  title: 'The wale and the pirate?xd',
  content: 'the history of a pirate who was trying to catch a big wale',
  tags: ['Pirates', 'Wholesome'],
  isPublished: true,
};
/* BEGIN - VARS for testing */
let token: string = '';
let postId: string = '';
let postIdToDelete: string = '';
let commentIdToDelete: string = '';
/* END   - VARS for testing */
jest.setTimeout(9999);
beforeAll(async () => {
  await Post.deleteMany({});
  await User.deleteMany({});
  // await Comment.deleteMany({});
  // await Like.deleteMany({});
});

test('Register', async () => {
  const { body } = await api
    .post('/api/users/')
    .send({
      username: user.username,
      password: user.password,
    })
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(body.username).toBe(user.username);
});

test('Login', async () => {
  const { body } = await api
    .post('/api/users/login')
    .send({
      username: user.username,
      password: user.password,
    })
    .expect(200)
    .expect('Content-Type', /application\/json/);

  token = body.token;
});

test('Post a Post', async () => {
  const { body } = await api
    .post('/api/posts/')
    .set('Authorization', 'Bearer ' + token)
    .send({
      title: post.title,
      content: post.content,
      tags: post.tags,
      isPublished: post.isPublished,
    })
    .expect(201)
    .expect('Content-Type', /application\/json/);
  postIdToDelete = body._id;
  expect(body.content).toBe(post.content);
});

test('Delete a Post', async () => {
  await api
    .delete(`/api/posts/${postIdToDelete}`)
    .set('Authorization', 'Bearer ' + token)
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('Post a Post', async () => {
  const { body } = await api
    .post('/api/posts/')
    .set('Authorization', 'Bearer ' + token)
    .send({
      title: post.title,
      content: post.content,
      tags: post.tags,
      isPublished: post.isPublished,
    })
    .expect(201)
    .expect('Content-Type', /application\/json/);
  postId = body._id;
  expect(body.content).toBe(post.content);
});

test('Get Posts', async () => {
  const { body } = await api
    .get('/api/posts?page=1&limit=5')
    .set('Authorization', 'Bearer ' + token)
    .expect(200)
    .expect('Content-Type', /application\/json/);
  expect(body.results).toHaveLength(1);
});

test('Get Post by id', async () => {
  const { body } = await api
    .get(`/api/posts/${postId}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);
  expect(body.content).toBe(post.content);
});

test('Put Post', async () => {
  const { body } = await api
    .put(`/api/posts/${postId}`)
    .set('Authorization', 'Bearer ' + token)
    .send({
      title: 'testing the PUT',
    })
    .expect(200)
    .expect('Content-Type', /application\/json/);
  expect(body.title).toBe('testing the PUT');
});

test('Post Comment', async () => {
  const { body } = await api
    .post(`/api/posts/${postId}/comments/`)
    .set('Authorization', 'Bearer ' + token)
    .send({
      content: 'a comment',
    })
    .expect(201)
    .expect('Content-Type', /application\/json/);
  expect(body.content).toBe('a comment');
});

test('Delete Comment', async () => {
  const { body } = await api
    .post(`/api/posts/${postId}/comments/${commentIdToDelete}`)
    .set('Authorization', 'Bearer ' + token)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  expect(body.content).toBe('a comment');
});
// test('Post Like-post', async () => {});
// test('Delete Like-post', async () => {});
// test('Post Like-comment', async () => {});
// test('Delete Like-comment', async () => {});

afterAll(() => {
  server.close();
});
