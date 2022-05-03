import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDb = async () => {
  try {
    let mongoDB =
      process.env.NODE_ENV == 'test'
        ? (process.env.DB_TEST as string)
        : (process.env.DB_DEV as string);

    process.env.NODE_ENV == 'test'
      ? console.log('Using test db')
      : console.log('Using dev db');
    await mongoose.connect(mongoDB);
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
