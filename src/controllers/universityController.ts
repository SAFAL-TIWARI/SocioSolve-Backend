import { Request, Response } from 'express';
import { University } from '../models/University.js';
import { Faculty } from '../models/Faculty.js';
import { Student } from '../models/Student.js';
import { Challenge } from '../models/Challenge.js';
import { Project } from '../models/Project.js';

export const UniversityController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const universities = await University.find();
      res.status(200).json({ success: true, data: universities });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const university = await University.findById(id);
      if (!university) {
        res.status(404).json({ success: false, message: 'University not found.' });
        return;
      }

      const [faculty, students, projects] = await Promise.all([
        Faculty.find({ universityRef: university._id }).populate('userRef', 'name email'),
        Student.find({ universityRef: university._id }).populate('userRef', 'name email'),
        Project.find({ universityRef: university._id }),
      ]);

      res.status(200).json({
        success: true,
        data: { university, faculty, students, projects },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getMatchedChallenges(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const university = await University.findById(id);
      if (!university) {
        res.status(404).json({ success: false, message: 'University not found.' });
        return;
      }

      // Match challenges that belong to disciplines/departments taught at university
      const matched = await Challenge.find({
        status: { $in: ['Under Review', 'Validated', 'Assigned', 'Solution Development'] },
      }).limit(15);

      res.status(200).json({
        success: true,
        data: matched,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
