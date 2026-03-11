import {
  NewPatient,
  Gender,
  NewEntry,
  HealthCheckRating,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckEntry,
  Diagnosis
} from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!dateOfBirth || !isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error('Incorrect or missing dateOfBirth: ' + dateOfBirth);
  }
  return dateOfBirth;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }
  return occupation;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [] as Array<Diagnosis['code']>;
  }
  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error('Incorrect or missing description');
  }
  return description;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist');
  }
  return specialist;
};

const parseDischarge = (discharge: unknown): HospitalEntry['discharge'] => {
  if (
    !discharge ||
    typeof discharge !== 'object' ||
    !('date' in discharge) ||
    !('criteria' in discharge)
  ) {
    throw new Error('Incorrect or missing discharge');
  }
  return {
    date: parseDate(discharge.date),
    criteria: parseDescription(discharge.criteria)
  };
};

const parseEmployerName = (employerName: unknown): string => {
  if (!employerName || !isString(employerName)) {
    throw new Error('Incorrect or missing employerName');
  }
  return employerName;
};

const parseSickLeave = (
  sickLeave: unknown
): OccupationalHealthcareEntry['sickLeave'] => {
  if (!sickLeave || typeof sickLeave !== 'object') {
    return undefined;
  }
  if (!('startDate' in sickLeave) || !('endDate' in sickLeave)) {
    throw new Error('Incorrect sickLeave');
  }
  return {
    startDate: parseDate(sickLeave.startDate),
    endDate: parseDate(sickLeave.endDate)
  };
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (rating === undefined || rating === null || typeof rating !== 'number') {
    throw new Error('Incorrect or missing healthCheckRating');
  }
  if (!Object.values(HealthCheckRating).includes(rating)) {
    throw new Error('Incorrect healthCheckRating');
  }
  return rating;
};

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing entry data');
  }

  const obj = object as { [key: string]: unknown };

  const base = {
    description: parseDescription(obj.description),
    date: parseDate(obj.date),
    specialist: parseSpecialist(obj.specialist),
    diagnosisCodes: parseDiagnosisCodes(obj)
  };

  const type = obj.type;
  if (!isString(type)) {
    throw new Error('Incorrect or missing type: ' + type);
  }

  switch (type) {
    case 'Hospital':
      return {
        ...base,
        type: 'Hospital',
        discharge: parseDischarge(obj.discharge)
      };
    case 'OccupationalHealthcare':
      return {
        ...base,
        type: 'OccupationalHealthcare',
        employerName: parseEmployerName(obj.employerName),
        sickLeave: parseSickLeave(obj.sickLeave)
      };
    case 'HealthCheck':
      return {
        ...base,
        type: 'HealthCheck',
        healthCheckRating: parseHealthCheckRating(obj.healthCheckRating)
      };
    default:
      throw new Error('Incorrect or missing entry type: ' + type);
  }
};

export const toNewPatientEntry = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  const obj = object as { [key: string]: unknown };

  const newEntry: NewPatient = {
    name: parseName(obj.name),
    dateOfBirth: parseDateOfBirth(obj.dateOfBirth),
    ssn: parseSsn(obj.ssn),
    gender: parseGender(obj.gender),
    occupation: parseOccupation(obj.occupation)
  };

  return newEntry;
};
