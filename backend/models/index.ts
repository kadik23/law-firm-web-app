import dbConfig from '../config/dbConfig';
import { Sequelize, DataTypes, Dialect } from 'sequelize';
import UserFactory from './Users';
import AttorneyFactory from './attorneys';
import FileFactory from './FIles';
import CategoryFactory from './Categories';
import BlogFactory from './Blogs';
import LikeFactory from './BlogsLikes';
import FavoriteFactory from './Favorites';
import BlogCommentFactory from './BlogComments';
import ServiceFactory from './Services';
import TestimonialFactory from './testimonials';
import ProblemFactory from './problems';
import ConsultationFactory from './Consultation';
import CommentsLikesFactory from './CommentsLikes';
import RequestServiceFactory from './request_service';
import ServiceFilesUploadedFactory from './service_files_uploaded';
import NotificationFactory from './Notifications';
import ConnectedUserFactory from './ConnectedUsers';
import AvailableSlotFactory from './AvailableSlot';
import { DB } from '../interfaces/DB';

const sequelizeOptions: any = {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect as Dialect,
    port: parseInt(dbConfig.port as string),
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
    dialectOptions: dbConfig.dialectOptions
};

const sequelize = new Sequelize(
    dbConfig.DB as string,
    dbConfig.USER as string,
    dbConfig.PASSWORD,
    sequelizeOptions
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

export const db: DB = {} as DB;

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = UserFactory(sequelize, DataTypes);
db.attorneys = AttorneyFactory(sequelize, DataTypes);
db.files = FileFactory(sequelize, DataTypes);
db.categories = CategoryFactory(sequelize, DataTypes);
db.blogs = BlogFactory(sequelize, DataTypes);
db.like = LikeFactory(sequelize, DataTypes);
db.favorites = FavoriteFactory(sequelize, DataTypes);
db.blogcomments = BlogCommentFactory(sequelize, DataTypes);
db.services = ServiceFactory(sequelize, DataTypes);
db.testimonials = TestimonialFactory(sequelize, DataTypes);
db.problems = ProblemFactory(sequelize, DataTypes);
db.Consultation = ConsultationFactory(sequelize, DataTypes);
db.commentsLikes = CommentsLikesFactory(sequelize, DataTypes);
db.request_service = RequestServiceFactory(sequelize, DataTypes);
db.service_files_uploaded = ServiceFilesUploadedFactory(sequelize, DataTypes);
db.notifications = NotificationFactory(sequelize, DataTypes);
db.connectedUsers = ConnectedUserFactory(sequelize, DataTypes);
db.AvailableSlot = AvailableSlotFactory(sequelize, DataTypes);



db.files.belongsTo(db.users, {
  foreignKey: 'userId',
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
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

db.blogs.belongsTo(db.categories, {
  foreignKey: 'categoryId',
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
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

db.blogcomments.belongsTo(db.blogs, {
    foreignKey: 'blogId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

db.blogcomments.belongsTo(db.blogcomments, {
    foreignKey: 'originalCommentId',
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
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

db.users.hasMany(db.testimonials, {
  foreignKey: 'userId',
  as: 'userTestimonials',
});
db.testimonials.belongsTo(db.services, {
  foreignKey: 'serviceId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
db.services.hasMany(db.testimonials, {
  foreignKey: 'serviceId',
  as: 'serviceTestimonials',
});
db.blogcomments.hasMany(db.commentsLikes, {
    foreignKey: 'commentId',
    as: 'commentLikes',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
db.notifications.belongsTo(db.users,{
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

db.request_service.belongsTo(db.users, {
  foreignKey: 'clientId',
  as: 'User',
});
db.users.hasMany(db.request_service, {
  foreignKey: 'clientId',
  as: 'serviceRequests',
});

db.request_service.belongsTo(db.services, {
  foreignKey: 'serviceId',
  as: 'service',
});
db.services.hasMany(db.request_service, {
  foreignKey: 'serviceId',
  as: 'serviceRequests',
});

Object.keys(db).forEach((modelName) => {
  if ((db as any)[modelName].associate) {
    (db as any)[modelName].associate(db);
  }
});
db.Consultation.belongsTo(db.problems, { foreignKey: 'problem_id', as: 'problem' });
db.problems.hasMany(db.Consultation, { foreignKey: 'problem_id' });
db.Consultation.belongsTo(db.users, { foreignKey: 'client_id', as: 'client' });
db.users.hasMany(db.Consultation, { foreignKey: 'client_id', as: 'consultations' });


db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch((err: Error) => {
    console.error('Error during database synchronization:', err);
  });
