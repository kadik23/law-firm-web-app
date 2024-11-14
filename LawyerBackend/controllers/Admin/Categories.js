require('dotenv').config();
const db = require('../../models')
const categories=db.categories

/**
 * @swagger
 * paths:
 *   /admin/categories/add:
 *     post:
 *       summary: "Add a new category"
 *       description: "Create a new category with a given name."
 *       tags:
 *         - Categories
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *               properties:
 *                 name:
 *                   type: string
 *                   maxLength: 20
 *                   example: "Technology"
 *       responses:
 *         '200':
 *           description: "Category created successfully"
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '403':
 *           description: "Forbidden - User is not an admin"
 *         '500':
 *           description: "Internal Server Error"
 */

const addCategory = async (req,res)=> {
    try {
        console.log("controller:" + req.body)
        const {name} = req.body;
        let newCategory = await categories.create({
            name
        });

        if (!newCategory) {
            return res.status(401).send('Error creating category');
        }else {
            return res.status(200).send(newCategory);
        }
    } catch (e) {
        console.error('Error creating category', e);
        res.status(500).send('Internal Server Error');
    }
};
/**
 * @swagger
 * paths:
 *   /admin/categories/delete:
 *     delete:
 *       summary: "Delete a category"
 *       description: "Delete an existing category by its ID."
 *       tags:
 *         - Categories
 *       security:
 *         - BearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *       responses:
 *         '200':
 *           description: "Category deleted successfully"
 *         '401':
 *           description: "Unauthorized - Missing or Invalid Token"
 *         '403':
 *           description: "Forbidden - User is not an admin"
 *         '404':
 *           description: "Category not found"
 *         '500':
 *           description: "Internal Server Error"
 */

const deleteCategory= async (req,res)=>{
    try {
        const {id} = req.body;
        let category = await categories.findByPk(id);

        if (!category) {
            return res.status(404).json("Category not found");
        }

        await category.destroy();
        return res.status(200).send(category);
    } catch (e) {
        console.error('Error deleting category', e);
        res.status(500).send('Internal Server Error');
    }
};
module.exports = {
    addCategory,
    deleteCategory
};
