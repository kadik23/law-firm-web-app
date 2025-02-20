require("dotenv").config();
const db = require("../../models");
const Problem = db.problems;



/**
 * @swagger
 * user/problems/{id}:
 *   get:
 *     summary: Get a single problem
 *     description: Retrieves a specific problem by its ID.
 *     tags:
 *       - Problems
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the problem
 *     responses:
 *       200:
 *         description: Problem details
 *       404:
 *         description: Problem not found
 *       500:
 *         description: Internal Server Error
 */
const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findByPk(id);

    if (!problem) {
      return res.status(404).send("Problem not found");
    }

    return res.status(200).json(problem);
  } catch (error) {
    console.error("Error fetching problem:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * user/problems:
 *   get:
 *     summary: Get all problems
 *     description: Retrieves a list of all problems from the database.
 *     tags:
 *       - Problems
 *     responses:
 *       200:
 *         description: A list of problems
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Problem'
 *       500:
 *         description: Internal Server Error
 */
const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.findAll();
    return res.status(200).json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).send("Internal Server Error");
  }
};


module.exports = {
  getProblemById,
  getAllProblems,
};
