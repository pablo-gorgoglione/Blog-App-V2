import mongoose from 'mongoose';
import Post from '../models/post';

const posts = [
  {
    author: '6269d06c3bac92b1c5d5bbdd',
    title: 'Post 1',
    content: 'Content 1',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '6269d06c3bac92b1c5d5bbdd',
    title: 'Post 2',
    content: 'Content 2',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '6269d06c3bac92b1c5d5bbdd',
    title: 'Post 3',
    content: 'Content 3',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '6269d06c3bac92b1c5d5bbdd',
    title: 'Post 4',
    content: 'Content 4',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '6269d06c3bac92b1c5d5bbdd',
    title: 'Post 5',
    content: 'Content 5',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '6269d06c3bac92b1c5d5bbdd',
    title: 'Post 6',
    content: 'Content 6',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '6269d06c3bac92b1c5d5bbdd',
    title: 'Post 7',
    content: 'Content 7',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '6269d06c3bac92b1c5d5bbdd',
    title: 'Post 8',
    content: 'Content 8',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '6269d06c3bac92b1c5d5bbdd',
    title: 'Post 9',
    content: 'Content 9',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '6269d06c3bac92b1c5d5bbdd',
    title: 'Post 10',
    content: 'Content 10',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '6269d06c3bac92b1c5d5bbdd',
    title: 'Post 11',
    content: 'Content 11',
    tags: ['1', '2'],
    isPublished: true,
  },
  {
    author: '6269d06c3bac92b1c5d5bbdd',
    title: 'Post 12',
    content: 'Content 12',
    tags: ['1', '2'],
    isPublished: true,
  },
];

const createPosts = async () => {
  const mongoDB =
    'mongodb+srv://m001-student:mongodbpablo321@sandbox.uhopf.mongodb.net/blog-app-v2?retryWrites=true&w=majority';
  await mongoose.connect(mongoDB);
  await Post.deleteMany();
  await Post.insertMany(posts);
  console.log('Data loaded');
};

createPosts();
