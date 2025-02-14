require("dotenv").config();
const db = require("../../models");
const Problem = db.problems;
const Service = db.services;
const Category = db.categories;

/**
 * @swagger
 * /problems:
 *   post:
 *     summary: Create a new problem
 *     description: Creates a new problem and associates it with a service and category.
 *     tags:
 *       - Problems
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - service_id
 *               - category_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Divorce Case"
 *               service_id:
 *                 type: integer
 *                 example: 101
 *               category_id:
 *                 type: integer
 *                 example: 202
 *     responses:
 *       201:
 *         description: Problem created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Problem'
 *       400:
 *         description: Invalid service_id or category_id
 *       500:
 *         description: Internal Server Error
 */
const createProblem = async (req, res) => {
  try {
    const { name, service_id, category_id } = req.body;

    const serviceExists = await Service.findByPk(service_id);
    if (!serviceExists) {
      return res.status(400).json({ message: "Invalid service_id. Service not found." });
    }

    const categoryExists = await Category.findByPk(category_id);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category_id. Category not found." });
    }

    const newProblem = await Problem.create({
      name,
      service_id,
      category_id
    });

    return res.status(201).json(newProblem);
  } catch (error) {
    console.error("Error creating problem:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /problems/{id}:
 *   delete:
 *     summary: Delete a problem by ID
 *     description: Deletes a specific problem from the database by its ID.
 *     tags:
 *       - Problems
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the problem to delete
 *     responses:
 *       200:
 *         description: Problem deleted successfully
 *       404:
 *         description: Problem not found
 *       500:
 *         description: Internal Server Error
 */
const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if problem exists
    const problem = await Problem.findByPk(id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found." });
    }

    // Delete the problem
    await problem.destroy();
    return res.status(200).json({ message: "Problem deleted successfully." });

  } catch (error) {
    console.error("Error deleting problem:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createProblem,
  deleteProblem,
};
