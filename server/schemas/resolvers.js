const { AuthenticationError } = require('apollo-server-express');
const { User, Topic, Post } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

                return userData;
            }

            throw new AuthenticationError('Not logged in');
        },

        getTopicByName: async (parent, args) => {
            const postData = await Topic.findOne({ name: args.name}).populate('posts').populate({
                path: 'posts',
                populate: 'comments'
              });
            return postData;
        },
        getTopics: async () => {
            //* removed .populate here because it is not needed for this query....i think
            return Topic.find();
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        addPost: async (parent, { postData }, context) => {
            if (context.topic) {
                const updatedTopic = await Topic.findByIdAndUpdate(
                    { _id: context.topic._id },
                    { $push: { posts: postData } },
                    { new: true }
                );

                return updatedTopic;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        addComment: async (parent, { commentData }, context) => {
            if (context.post) {
                const updatedPost = await Post.findByIdAndUpdate(
                    { _id: context.post._id },
                    { $push: { comments: commentData } },
                    { new: true }
                );

                return updatedPost;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        removeComment: async (parent, { commentId }, context) => {
            if (context.topic) {
                const updatedTopic = await Topic.findOneAndUpdate(
                    { _id: context.topic._id },
                    { $pull: { comments: { commentId } } },
                    { new: true }
                );

                return updatedTopic;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        
    },
};

module.exports = resolvers;
