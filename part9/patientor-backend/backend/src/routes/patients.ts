import express from 'express';
import patientService from '../services/patientService';
import { parseNewPatientWithZod } from '../zodSchemas';
import { ZodError } from 'zod';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(patientService.getNonSensitivePatients());
});

router.post('/', (req, res) => {
  try {
    const newPatient = parseNewPatientWithZod(req.body);

    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      return res.status(400).json({
        error: 'Invalid patient data',
        details: e.format()
      });
    }

    let errorMessage = 'Something went wrong.';
    if (e instanceof Error) {
      errorMessage += ' Error: ' + e.message;
    }
    return res.status(400).send(errorMessage);
  }
});

export default router;
