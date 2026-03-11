import patients from '../data/patients';
import { Patient, NonSensitivePatient, NewPatient, NewEntry, Entry } from '../types';
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ ssn, entries, ...rest }) => rest);
};

const getPatient = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    ...entry,
    entries: []
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, newEntry: NewEntry): Entry => {
  const patient = patients.find(p => p.id === patientId);
  if (!patient) {
    throw new Error('Patient not found');
  }

  const entry: Entry = {
    id: uuid(),
    ...newEntry
  };

  patient.entries.push(entry);
  return entry;
};

export default {
  getPatients,
  getNonSensitivePatients,
  getPatient,
  addPatient,
  addEntry
};
