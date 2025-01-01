const dbConfig = require('../config/dbConfig.js');

const {Sequelize, DataTypes} = require('sequelize');

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

sequelize.authenticate()
.then(() => {
    console.log('connected..')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('./Users.js')(sequelize, DataTypes)
const Attorney = require('./attorneys')(sequelize, Sequelize.DataTypes);
db.Attorney = Attorney;
db.files = require('./FIles.js')(sequelize, DataTypes)
db.categories = require('./Categories.js')(sequelize, DataTypes)
db.blogs = require('./Blogs.js')(sequelize, DataTypes)

db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
})

db.files.belongsTo(db.users,{
    foreignKey:'userId',
    allowNull:false,
    onDelete:"CASCADE",
    onUpdate:"CASCADE",
})

db.blogs.belongsTo(db.users,{
    foreignKey:'userId',
    allowNull:false,
    onDelete:"CASCADE",
    onUpdate:"CASCADE",
})

db.blogs.belongsTo(db.categories,{
    foreignKey:'categoryId',
    allowNull:false,
    onDelete:"CASCADE",
    onUpdate:"CASCADE",
})
module.exports = db