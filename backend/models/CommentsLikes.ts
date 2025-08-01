import { Sequelize, DataTypes as SequelizeDataTypes, Model, ModelCtor } from 'sequelize';
import { ICommentsLikes } from '../interfaces/CommentsLikes';

const CommentsLikesFactory = (sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes): ModelCtor<Model<ICommentsLikes>> => {
    const commentsLikes = sequelize.define<Model<ICommentsLikes>>("comments_likes", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        commentId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
    
    return commentsLikes;
};

export default CommentsLikesFactory;

/**
 * @swagger
 * components:
 *   schemas:
 *     CommenstLikes:
 *       type: object
 *       required:
 *         - userId
 *         - commentId
 *       properties:
 *         userId:
 *           type: integer
 *         commentId:
 *           type: integer
 */