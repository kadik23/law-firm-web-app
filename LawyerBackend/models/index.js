const dbConfig = require('../config/dbConfig.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        port: dbConfig.port, 
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle

        }
    }
)

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./Users')(sequelize, DataTypes);
db.attorneys = require('./attorneys')(sequelize, DataTypes);
db.files = require('./FIles')(sequelize, DataTypes);
db.categories = require('./Categories')(sequelize, DataTypes);
db.blogs = require('./Blogs')(sequelize, DataTypes);
db.like = require('./BlogsLikes.js')(sequelize, DataTypes);
db.favorites = require('./Favorites.js')(sequelize, DataTypes);
db.blogcomments = require('./BlogComments.js')(sequelize, DataTypes);
db.services = require('./Services.js')(sequelize, DataTypes);
db.testimonials = require("./Testimonials")(sequelize, DataTypes);
db.problems = require("./problems.js")(sequelize, DataTypes);
db.Consultation = require("./Consultation")(sequelize, DataTypes);
db.commentsLikes = require("./CommentsLikes")(sequelize, DataTypes);
db.request_service = require('./request_service.js')(sequelize, DataTypes);
db.service_files_uploaded = require('./service_files_uploaded.js')(sequelize, DataTypes);
db.notifications=require('./Notifications.js')(sequelize,DataTypes);
db.connectedUsers=require('./ConnectedUsers.js')(sequelize,DataTypes);



db.files.belongsTo(db.users, {
  foreignKey: 'userId',
  allowNull: false,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

db.users.hasOne(db.attorneys, {
  foreignKey: "user_id",
  as: "Attorney"
});

db.attorneys.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "User"
});
db.blogs.belongsTo(db.users, {
  foreignKey: 'userId',
  allowNull: false,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

db.blogs.belongsTo(db.categories, {
  foreignKey: 'categoryId',
  allowNull: false,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});


db.blogs.belongsToMany(db.users, {
  through: db.favorites,
  as: 'FavoritedBy',
  foreignKey: 'blogId',
  otherKey: 'userId',
});

db.users.belongsToMany(db.blogs, {
  through: db.favorites,
  as: 'FavoriteBlogs',
  foreignKey: 'userId',
  otherKey: 'blogId',
});

db.blogs.belongsToMany(db.users, {
  through: db.like,
  as: 'LikedBy',
  foreignKey: 'blogId',
  otherKey: 'userId',
});

db.users.belongsToMany(db.blogs, {
  through: db.like,
  as: 'LikeBlogs',
  foreignKey: 'userId',
  otherKey: 'blogId',
});

db.blogcomments.belongsTo(db.users, {
    foreignKey: 'userId',
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

db.blogcomments.belongsTo(db.blogs, {
    foreignKey: 'blogId',
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

db.blogcomments.belongsTo(db.blogcomments, {
    foreignKey: 'originalCommentId',
    allowNull: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

db.services.belongsTo(db.users, {
  foreignKey: 'createdBy',
  as: 'creator',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

db.users.hasMany(db.services, {
  foreignKey: 'createdBy',
  as: 'userServices',
});
db.testimonials.belongsTo(db.users, {
  foreignKey: 'userId',
  allowNull: false,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

db.users.hasMany(db.testimonials, {
  foreignKey: 'userId',
  as: 'userTestimonials',
});
db.blogcomments.hasMany(db.commentsLikes, {
    foreignKey: 'commentId',
    as: 'commentLikes',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
db.notifications.belongsTo(db.users,{
    foreignKey: 'userId',
    allowNull: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch((err) => {
    console.error('Error during database synchronization:', err);
  });

// console.log(db.services);
//
// console.log(db.blogs.associations);
// console.log(db.users.associations);
// console.log(db.favorites.associations);
// console.log(db.like.associations);
// console.log("Loaded Models:", Object.keys(db));
// console.log("Testimonial Associations:", db.testimonials?.associations);

module.exports = db
