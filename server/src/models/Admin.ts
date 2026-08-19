import { Schema, model, Document } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'ADMIN';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, default: 'Hotel Raama Manager' },
    role: { type: String, enum: ['ADMIN'], default: 'ADMIN' },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export const Admin = model<IAdmin>('Admin', AdminSchema);
