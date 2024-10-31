require('dotenv').config();
const db = require('../../models')
const blogs=db.blogs
const getAllBlogs= async (req,res)=>{
    try {
        let blogsList = await blogs.findAll();
        return res.status(200).send(blogsList);
    } catch (e) {
        console.error('Error fetching blogs', e);
        res.status(500).send('Internal Server Error');
    }
};
module.exports = {
   getAllBlogs
};