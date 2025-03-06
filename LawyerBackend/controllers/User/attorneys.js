require('dotenv').config();
const db = require('../../models');
const path = require('path');
const fs = require('fs');
const attorneys = db.attorneys;
const User = db.users;

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
      attorneyList = await Promise.all(attorneyList.map(async (attorney) => {
        const filePath = path.resolve(__dirname, '..', '..', attorney.picture_path);

        let base64Image = null;
        if (fs.existsSync(filePath)) {
          const fileData = fs.readFileSync(filePath);
          base64Image = `data:image/png;base64,${fileData.toString('base64')}`;
        }

        return {
          ...attorney.toJSON(),
          picture: base64Image
        };
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

const updateAttorney = async (req, res) => {
  try {

    const {
      id,
      first_name,
      last_name,
      email,
      password,
      phone_number,
      city,
      age,
      sex,
      pays,
      ville,
      linkedin_url,
      certificats
    } = req.body;


    const attorney = await attorneys.findOne({ where: { id: id } });
    if (!attorney) {
      return res.status(404).send({ error: 'Attorney not found' });
    }


    const user = await User.findOne({ where: { id: attorney.user_id } });
    if (!user) {
      return res.status(404).send({ error: 'Associated user not found' });
    }


    let picturePath = attorney.picture_path;
    if (req.file) {

      if (picturePath) {
        const oldFilePath = path.resolve(picturePath);
        fs.unlink(oldFilePath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Error deleting old file:', err);
          }
        });
      }
      picturePath = req.file.path;
    }


    const updatedUserData = {
      name: first_name || user.name,
      surname: last_name || user.surname,
      email: email || user.email,
      phone_number: phone_number || user.phone_number,
      city: city || user.city,
      age: age || user.age,
      sex: sex || user.sex,
      pays: pays || user.pays,
      ville: ville || user.ville
    };


    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedUserData.password = await bcrypt.hash(password, salt);
    }

    await User.update(updatedUserData, { where: { id: user.id } });

    // Update attorney info
    await attorneys.update(
        {
          linkedin_url: linkedin_url || attorney.linkedin_url,
          certificats: certificats || attorney.certificats,
          picture_path: picturePath
        },
        { where: { id: id } }
    );

    return res.status(200).send({ message: 'Attorney information updated successfully' });
  } catch (error) {
    console.error('Error updating attorney:', error);
    return res.status(500).send({ error: 'Failed to update attorney' });
  }
};




module.exports = {
  getAllAttorneys,
  updateAttorney
};
