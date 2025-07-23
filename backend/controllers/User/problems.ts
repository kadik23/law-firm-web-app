import dotenv from 'dotenv';
dotenv.config();
import { db } from '@/models/index';
import { Request, Response } from 'express';
import { Model, ModelCtor } from 'sequelize';
import { IProblem } from '@/interfaces/Problem';
import { ICategory } from '@/interfaces/Category';

const Problem: ModelCtor<Model<IProblem>> = db.problems;
const Category: ModelCtor<Model<ICategory>> = db.categories;

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
const getProblemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const problem = await Problem.findByPk(id);

    if (!problem) {
      res.status(404).send("Problem not found");
      return;
    }

    res.status(200).json(problem);
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
const getAllProblems = async (req: Request, res: Response): Promise<void> => {
  try {
    const problems = await Problem.findAll();
    res.status(200).json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getAllProblemsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const problems = await Problem.findAll({
      include: [
        {
          model: Category,
          as: 'category', 
          where: { id: req.params.category_id },
          attributes: [],
        },
      ],
    });
    res.status(200).json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).send("Internal Server Error");
  }
};

export { getProblemById, getAllProblems, getAllProblemsByCategory };
