import express from 'express';
import patientService from '../services/patientService';
import { parseNewPatientWithZod } from '../zodSchemas';
import { ZodError } from 'zod';
import { toNewEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(patientService.getNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  const patient = patientService.getPatient(req.params.id);

  if (!patient) {
    return res.status(404).send({ error: 'Patient not found' });
  }

  return res.json(patient);
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

router.post('/:id/entries', (req, res) => {
  try {
    const newEntry = toNewEntry(req.body);
    const addedEntry = patientService.addEntry(req.params.id, newEntry);
    res.json(addedEntry);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return res.status(400).send(e.message);
    }
    return res.status(400).send('Unknown error');
  }
});


export default router;
