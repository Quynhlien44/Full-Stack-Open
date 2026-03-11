import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

import { Patient, Entry, Diagnosis } from "../types";
import patientService from "../services/patients";

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
        <div key={entry.id} style={{ marginBottom: "0.75em" }}>
          <Typography>
            {entry.date} <em>{entry.description}</em>
          </Typography>
          {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
            <ul>
              {entry.diagnosisCodes.map(code => {
                const diag = findDiagnosis(code);
                return (
                  <li key={code}>
                    {code} {diag ? diag.name : ""}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default PatientPage;
