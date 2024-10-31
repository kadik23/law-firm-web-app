require('dotenv').config();
const db = require('../../models')
const categories=db.categories

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
