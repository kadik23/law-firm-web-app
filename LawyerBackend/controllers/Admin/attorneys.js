const db = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = db.users;
const Attorney = db.Attorney;

const createAttorney = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone_number,
    city,
    age,
    sex,
    linkedin_url,
    certificats,
    date_membership,
    pays,
    terms_accepted,
    status
  } = req.body;

  if (!first_name || !last_name || !email || !password || !linkedin_url || !pays || !terms_accepted || !status) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({ error: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: first_name,
      surname: last_name,
      email,
      password: hashedPassword,
      phone_number: phone_number,
      city: city ,
      age: age,
      sex: sex,
      pays,
      ville: city,
      terms_accepted,
      type: 'attorney'
    });

    const newAttorney = await Attorney.create({
      user_id: newUser.id,
      status,
      linkedin_url,
      certificats: certificats || null,
      date_membership: date_membership ? new Date(date_membership) : new Date(),
    });

    console.log('Attorney created successfully:', newAttorney);
    return res.status(201).send({ message: 'Attorney created successfully', user: newUser, attorney: newAttorney });

  } catch (error) {
    console.error('Error creating attorney:', error);
    return res.status(500).send('Failed to create attorney');
  }
};

module.exports = {
  createAttorney
};
