import mongoose, { Schema, Document } from 'mongoose';

export interface IUniversity extends Document {
  name: string;
  code: string;
  location: {
    district: string;
    state: string;
    city: string;
  };
  departments: string[];
  disciplines: string[];
  facultyCount: number;
  studentCount: number;
  labs: string[];
  researchCenters: string[];
  incubationCenters: string[];
  patentsCount: number;
  activeProjectsCount: number;
  website?: string;
}

const UniversitySchema = new Schema<IUniversity>({
  name: { type: String, required: true, unique: true, index: true },
  code: { type: String, required: true, unique: true },
  location: {
    district: { type: String, required: true },
    state: { type: String, default: 'Jharkhand' },
    city: { type: String, required: true },
  },
  departments: [{ type: String }],
  disciplines: [{ type: String }],
  facultyCount: { type: Number, default: 0 },
  studentCount: { type: Number, default: 0 },
  labs: [{ type: String }],
  researchCenters: [{ type: String }],
  incubationCenters: [{ type: String }],
  patentsCount: { type: Number, default: 0 },
  activeProjectsCount: { type: Number, default: 0 },
  website: { type: String },
}, { timestamps: true });

export const University = mongoose.model<IUniversity>('University', UniversitySchema);
