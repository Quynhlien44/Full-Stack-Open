import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

import { Patient } from "../types";
import patientService from "../services/patients";

const PatientPage = () => {
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

  return (
    <div>
      <Typography variant="h4" style={{ marginTop: "0.5em", marginBottom: "0.5em" }}>
        {patient.name}{" "}
        {patient.gender === "male" && "♂"}
        {patient.gender === "female" && "♀"}
        {patient.gender === "other" && "⚧"}
      </Typography>
      {patient.ssn && (
        <Typography>ssn: {patient.ssn}</Typography>
      )}
      {patient.dateOfBirth && (
        <Typography>date of birth: {patient.dateOfBirth}</Typography>
      )}
      <Typography>occupation: {patient.occupation}</Typography>
    </div>
  );
};

export default PatientPage;
