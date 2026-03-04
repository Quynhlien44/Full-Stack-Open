import patients from '../data/patients';
import { Patient, NonSensitivePatient } from '../types';

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ ssn, ...rest }) => rest);
};

export default {
  getPatients,
  getNonSensitivePatients
};