require('dotenv').config();
const db = require('../../models')
const categories=db.categories
const getAllCategories= async (req,res)=>{
    try {

        let categoryList = await categories.findAll();


        return res.status(200).send(categoryList);
    } catch (e) {
        console.error('Error fetching categories', e);
        res.status(500).send('Internal Server Error');
    }
};
const getCategoryByName= async (req,res)=>{
    try {
        const {name} = req.body;
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