import { z } from 'zod';
import { Gender, NewPatient } from './types';

export const NewPatientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dateOfBirth: z.string().date('Invalid dateOfBirth'),
  ssn: z.string().min(1, 'SSN is required'),
  gender: z.nativeEnum(Gender),
  occupation: z.string().min(1, 'Occupation is required')
});

export type NewPatientZod = z.infer<typeof NewPatientSchema>;

export const parseNewPatientWithZod = (data: unknown): NewPatient => {
  const parsed = NewPatientSchema.parse(data);
  return parsed;
};
