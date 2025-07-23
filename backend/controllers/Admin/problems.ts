import { Request, Response } from 'express';
import { db } from '@/models/index';
import { Model, ModelCtor } from 'sequelize';
import { IProblem } from '@/interfaces/Problem';
import { IService } from '@/interfaces/Service';
import { ICategory } from '@/interfaces/Category';

const Problem: ModelCtor<Model<IProblem>> = db.problems;
const Service: ModelCtor<Model<IService>> = db.services;
const Category: ModelCtor<Model<ICategory>> = db.categories;

/**
 * @swagger
 * /admin/problems:
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
export const createProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, service_id, category_id } = req.body;
    const serviceExists: Model<IService> | null = await Service.findByPk(service_id);
    if (!serviceExists) {
      res.status(400).json({ message: 'Invalid service_id. Service not found.' });
      return;
    }
    const categoryExists: Model<ICategory> | null = await Category.findByPk(category_id);
    if (!categoryExists) {
      res.status(400).json({ message: 'Invalid category_id. Category not found.' });
      return;
    }
    const newProblem: Model<IProblem> = await Problem.create({
      name,
      service_id,
      category_id
    } as IProblem);
    res.status(201).json(newProblem);
  } catch (error: any) {
    console.error('Error creating problem:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * @swagger
 * admin/problems/{id}:
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
export const deleteProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const problem: Model<IProblem> | null = await Problem.findByPk(id);
    if (!problem) {
      res.status(404).json({ message: 'Problem not found.' });
      return;
    }
    await problem.destroy();
    res.status(200).json({ message: 'Problem deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting problem:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
