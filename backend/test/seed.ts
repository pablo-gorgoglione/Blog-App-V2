import mongoose from 'mongoose';
import Post from '../models/post';
import User from '../models/user';
import bcrypt from 'bcryptjs';

const posts = [
  {
    author: '',
    title: 'Post 1',
    content: 'Content 1',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '',
    title: 'Post 2',
    content: 'Content 2',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '',
    title: 'Post 3',
    content: 'Content 3',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '',
    title: 'Post 4',
    content: 'Content 4',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '',
    title: 'Post 5',
    content: 'Content 5',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '',
    title: 'Post 6',
    content: 'Content 6',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '',
    title: 'Post 7',
    content: 'Content 7',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '',
    title: 'Post 8',
    content: 'Content 8',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '',
    title: 'Post 9',
    content: 'Content 9',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '',
    title: 'Post 10',
    content: 'Content 10',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '',
    title: 'Post 11',
    content: 'Content 11',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '',
    title: 'Post 12',
    content: 'Content 12',
    tags: ['1', '2'],
    isPublished: true,
  },
];

const user = {
  username: 'Pablo',
  password: '12345',
  isAdmin: true,
};

const createPosts = async () => {
  const mongoDB =
    'mongodb+srv://m001-student:mongodbpablo321@sandbox.uhopf.mongodb.net/blog-app-v2?retryWrites=true&w=majority';
  await mongoose.connect(mongoDB);
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(user.password, salt);
  user.password = hashPassword;
  const myuser = await User.create(user);
  const postWithUser = posts.map((p) => {
    p.author = myuser.id;
    return p;
  });
  await Post.deleteMany();
  await Post.insertMany(postWithUser);
  console.log('Data loaded');
};

createPosts();
