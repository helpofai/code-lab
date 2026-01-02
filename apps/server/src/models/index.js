const User = require('./User.model');
const Pen = require('./Pen.model');
const Post = require('./Post.model');

User.hasMany(Pen, { foreignKey: 'userId', as: 'pens' });
Pen.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Pen,
  Post,
};
