import { User } from '../models/index.js';
import { signToken } from '../services/auth.js';
import fetch from 'node-fetch';

const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (context.user) {
        return await User.findById(context.user._id);
      }
      throw new Error('Not authenticated');
    },
    searchBooks: async (_: any, { query }: any) => {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      const data = await response.json();
      return data.items.map((book: any) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || [],
        description: book.volumeInfo.description || '',
        title: book.volumeInfo.title,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink || ''
      }));
    }
  },

  Mutation: {
    addUser: async (_: any, { username, email, password }: any) => {
      const user = await User.create({ username, email, password });
      const token = signToken(username, email, user._id);
      return { token, user };
    },
    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new Error('Invalid credentials');
      }
      const token = signToken(user.username, email, user._id);
      return { token, user };
    },
    saveBook: async (_: any, { bookData }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      return await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: bookData } },
        { new: true, runValidators: true }
      );
    },
    removeBook: async (_: any, { bookId }: any, context: any) => {
      if (!context.user) throw new Error('Not authenticated');

      return await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    }
  }
};




export default resolvers;
