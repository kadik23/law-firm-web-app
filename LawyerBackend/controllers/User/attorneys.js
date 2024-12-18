require('dotenv').config();
const db = require('../../models');
const attorneys = db.Attorney;

const getAllAttorneys = async (req, res) => {
  try {
    let attorneyList = await attorneys.findAll();
    if(attorneyList){
      return res.status(200).send(attorneyList);
    }else {
      return res.status(401).send('Error fetching attorneys');
    }
  } catch (e) {
    console.error('Error returning attorneys', e);
    res.status(500).send('Internal Server Error');
  }
};
module.exports = {
getAllAttorneys
};