import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

import { Patient, Entry, Diagnosis } from "../types";
import patientService from "../services/patients";

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "0.5rem 0.75rem",
            marginBottom: "0.5rem"
          }}
        >
          <Typography>
            {entry.date} <LocalHospitalIcon fontSize="small" />
          </Typography>
          <Typography>
            <em>{entry.description}</em>
          </Typography>
          {entry.diagnosisCodes && (
            <ul>
              {entry.diagnosisCodes.map(code => (
                <li key={code}>{code}</li>
              ))}
            </ul>
          )}
          <Typography variant="body2">
            discharge: {entry.discharge.date} ({entry.discharge.criteria})
          </Typography>
          <Typography variant="body2">
            diagnose by {entry.specialist}
          </Typography>
        </div>
      );

    case "OccupationalHealthcare":
      return (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "0.5rem 0.75rem",
            marginBottom: "0.5rem"
          }}
        >
          <Typography>
            {entry.date} <WorkIcon fontSize="small" /> {entry.employerName}
          </Typography>
          <Typography>
            <em>{entry.description}</em>
          </Typography>
          {entry.diagnosisCodes && (
            <ul>
              {entry.diagnosisCodes.map(code => (
                <li key={code}>{code}</li>
              ))}
            </ul>
          )}
          {entry.sickLeave && (
            <Typography variant="body2">
              sick leave: {entry.sickLeave.startDate} – {entry.sickLeave.endDate}
            </Typography>
          )}
          <Typography variant="body2">
            diagnose by {entry.specialist}
          </Typography>
        </div>
      );

    case "HealthCheck":
      return (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "0.5rem 0.75rem",
            marginBottom: "0.5rem"
          }}
        >
          <Typography>
            {entry.date} <FavoriteIcon fontSize="small" />
          </Typography>
          <Typography>
            <em>{entry.description}</em>
          </Typography>
          { }
          <FavoriteIcon
            style={{
              color: entry.healthCheckRating === 0 ? "green" : "orange"
            }}
          />
          <Typography variant="body2">
            diagnose by {entry.specialist}
          </Typography>
        </div>
      );

    default:
      return assertNever(entry);
  }
};

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPatient = async () => {
      const data = await patientService.getOne(id);
      setPatient(data);
    };
    void fetchPatient();
  }, [id]);

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  const genderSymbol =
    patient.gender === "male"
      ? "♂"
      : patient.gender === "female"
      ? "♀"
      : "⚧";

  const findDiagnosis = (code: string) =>
    diagnoses.find(d => d.code === code);

  return (
    <div>
      <Typography
        variant="h4"
        style={{ marginTop: "0.5em", marginBottom: "0.5em", fontWeight: 600 }}
      >
        {patient.name} {genderSymbol}
      </Typography>
      {patient.ssn && <Typography>ssn: {patient.ssn}</Typography>}
      {patient.dateOfBirth && (
        <Typography>date of birth: {patient.dateOfBirth}</Typography>
      )}
      <Typography>occupation: {patient.occupation}</Typography>

      <Typography
        variant="h5"
        style={{ marginTop: "1.5em", marginBottom: "0.5em", fontWeight: 600 }}
      >
        entries
      </Typography>

      {patient.entries && patient.entries.map((entry: Entry) => (
        <EntryDetails key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default PatientPage;
