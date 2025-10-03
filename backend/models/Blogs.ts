import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelCtor } from 'sequelize';
import { IBlog } from '../interfaces/Blog';

const BlogFactory = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelCtor<Model<IBlog>> => {
  const Blog = sequelize.define<Model<IBlog>>('blogs', {
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    readingDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    file_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    rejectionReason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, { tableName: "blogs" });

  return Blog;
};

export default BlogFactory;
/**
* @swagger
* components:
*  schemas:
*    Blog:
*      type: object
*      required:
*        - title
*        - readingDuration
*        - body
*        - image
*        - categoryId
*        - userId
*        - accepted
*        - likes
*      properties:
*        title:
*          type: string
*          maxLength: 20
*          example: "My First Blog"
*        body:
*          type: string
*          maxLength: 500
*          example: "This is the content of the blog post."
*        likes:
*          type: integer
*          example: 0
*        image:
*          type: string
*          maxLength: 50
*          example: "image.jpg"
*        categoryId:
*          type: integer
*          example: 1
*        userId:
*          type: integer
*          example: 42
*        accepted:
*          type: boolean
*          example: true
*
* */