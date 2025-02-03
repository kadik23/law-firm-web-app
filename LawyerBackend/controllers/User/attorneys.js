require('dotenv').config();
const db = require('../../models');
const path = require('path');
const attorneys = db.attorneys;

/**
 * @swagger
 * /user/attorneys:
 *   get:
 *     summary: Retrieve a list of all attorneys
 *     description: This endpoint retrieves all attorneys from the database.
 *     tags:
 *       - Attorneys
 *     responses:
 *       200:
 *         description: A list of attorneys
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attorney'
 *       401:
 *         description: Error fetching attorneys
 *       500:
 *         description: Internal Server Error - An error occurred while fetching attorneys
 */
const getAllAttorneys = async (req, res) => {
  try {
    let attorneyList = await attorneys.findAll();

    if (attorneyList) {

      attorneyList = attorneyList.map(attorney => ({
        ...attorney.toJSON(),
        picture_url: `http://localhost:${process.env.PORT}/${attorney.picture_path.replace(/\\/g, '/')}`
      }));

      return res.status(200).json(attorneyList);
    } else {
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
