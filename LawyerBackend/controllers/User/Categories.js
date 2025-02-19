require('dotenv').config();
const db = require('../../models')
const categories=db.categories
/**
 * @swagger
 * /user/categories/all:
 *   get:
 *     summary: Retrieve a list of all categories
 *     description: This endpoint retrieves all categories from the database.
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal Server Error - An error occurred while fetching categories
 */
const getAllCategories= async (req,res)=>{
    try {

        let categoryList = await categories.findAll();


        return res.status(200).send(categoryList);
    } catch (e) {
        console.error('Error fetching categories', e);
        res.status(500).send('Internal Server Error');
    }
};
/**
 * @swagger
 * /user/categories/name:
 *   get:
 *     summary: Retrieve a category by name
 *     description: This endpoint retrieves a category by its name.
 *     tags:
 *       - Categories
 *     requestParams:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category to retrieve
 *                 example: "Technology"
 *     responses:
 *       200:
 *         description: The category with the specified name
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal Server Error - An error occurred while fetching the category
 */
const getCategoryByName= async (req,res)=>{
    try {
        const {name} = req.params;
        let category = await categories.findAll({ where: { name } });


        return res.status(200).send(category);
    } catch (e) {
        console.error('Error fetching categories', e);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getAllCategories,
    getCategoryByName
};