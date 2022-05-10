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
let commentId: string = '';
let commentCounter = 0;
let likeCounterPost = 0;
let likeCounterComment = 0;
/* END   - VARS for testing */
beforeAll(async () => {
  Promise.all([
    Post.deleteMany({}),
    User.deleteMany({}),
    Comment.deleteMany({}),
    Like.deleteMany({}),
  ]);
});

test('User 1 - Register', async () => {
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

test('User 2 - Login', async () => {
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

test('Post 1 - Post a Post to delete', async () => {
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

test('Post 2 - Delete a Post', async () => {
  await api
    .delete(`/api/posts/${postIdToDelete}`)
    .set('Authorization', 'Bearer ' + token)
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('Post 3 - Post a Post', async () => {
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

test('Post 4 - Get Posts', async () => {
  const { body } = await api
    .get('/api/posts?page=1&limit=5')
    .set('Authorization', 'Bearer ' + token)
    .expect(200)
    .expect('Content-Type', /application\/json/);
  expect(body.results).toHaveLength(1);
});

test('Post 5 - Get Post by id', async () => {
  const { body } = await api
    .get(`/api/posts/${postId}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);
  expect(body.post.content).toBe(post.content);
});

test('Post 6 - Put Post', async () => {
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

test('Comment 1 - Post a Comment', async () => {
  //fetch the comment to delete
  const { body } = await api
    .post(`/api/posts/${postId}/comments/`)
    .set('Authorization', 'Bearer ' + token)
    .send({
      content: 'a comment',
    })
    .expect(201)
    .expect('Content-Type', /application\/json/);
  commentIdToDelete = body.comment._id;

  //create another comment
  const res = await api
    .post(`/api/posts/${postId}/comments/`)
    .set('Authorization', 'Bearer ' + token)
    .send({
      content: 'a comment',
    })
    .expect(201)
    .expect('Content-Type', /application\/json/);
  commentId = res.body.comment._id;
  expect(res.body.comment.content).toBe('a comment');
  //create 2
  commentCounter = commentCounter + 2;
  expect(res.body.commentCounter).toBe(commentCounter);
});

test('Comment 2 - Delete a Comment', async () => {
  const { body } = await api
    .delete(`/api/posts/${postId}/comments/${commentIdToDelete}`)
    .set('Authorization', 'Bearer ' + token)
    .expect(200)
    .expect('Content-Type', /application\/json/);
  //delete one
  commentCounter = commentCounter - 1;
  expect(body.commentCounter).toBe(commentCounter);
});

test('Like/Post 1 - Post ', async () => {
  const { body } = await api
    .post(`/api/posts/${postId}/like/`)
    .set('Authorization', 'Bearer ' + token)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  likeCounterPost++;
  expect(body.likeCounter).toBe(likeCounterPost);
  expect(body.likedPosts).toEqual([postId]);
});

test('Like/Post 2 - Delete ', async () => {
  const { body } = await api
    .delete(`/api/posts/${postId}/like/`)
    .set('Authorization', 'Bearer ' + token)
    .expect(200)
    .expect('Content-Type', /application\/json/);
  likeCounterPost--;

  expect(body.likeCounter).toBe(likeCounterPost);
  expect(body.likedPosts).toEqual([]);
});

test('Like/Comment 3 - Post ', async () => {
  const { body } = await api
    .post(`/api/posts/${postId}/comments/${commentId}/like`)
    .set('Authorization', 'Bearer ' + token)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  likeCounterComment++;

  expect(body.likeCounter).toBe(likeCounterComment);
  expect(body.likedComments).toEqual([commentId]);
});

test('Like/Comment 4 - Delete ', async () => {
  const { body } = await api
    .delete(`/api/posts/${postId}/comments/${commentId}/like`)
    .set('Authorization', 'Bearer ' + token)
    .expect(200)
    .expect('Content-Type', /application\/json/);
  likeCounterComment--;
  expect(body.likeCounter).toBe(likeCounterComment);
  expect(body.likedComments).toEqual([]);
});

afterAll(() => {
  server.close();
});
