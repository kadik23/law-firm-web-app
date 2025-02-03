module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define(
    "blogs",
    {
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
        type: DataTypes.STRING(50),
        allowNull: false,
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
    },
    { tableName: "blogs" }
  );

  return Blog;
};
/**
* @swagger
* components:
*  schemas:
*    Blog:
*      type: object
*      required:
*        - title
         - readingDuration
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