import axios from "axios";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, TextField, Button, Alert, Box } from "@mui/material";

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

  // common fields
  const [entryType, setEntryType] = useState<
    "HealthCheck" | "Hospital" | "OccupationalHealthcare"
  >("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState("");
  const [diagnosisCodesInput, setDiagnosisCodesInput] = useState("");

  // Hospital
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  // OccupationalHealthcare
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPatient = async () => {
      const data = await patientService.getOne(id);
      setPatient(data);
    };
    void fetchPatient();
  }, [id]);

  if (!patient || !id) {
    return <Typography>Loading...</Typography>;
  }

  const genderSymbol =
    patient.gender === "male"
      ? "♂"
      : patient.gender === "female"
      ? "♀"
      : "⚧";

  const resetForm = () => {
    setDescription("");
    setDate("");
    setSpecialist("");
    setHealthCheckRating("");
    setDiagnosisCodesInput("");
    setDischargeDate("");
    setDischargeCriteria("");
    setEmployerName("");
    setSickLeaveStart("");
    setSickLeaveEnd("");
    setError(null);
  };

  const handleAddEntry = async () => {
    try {
      const diagnosisCodes =
        diagnosisCodesInput.trim() === ""
          ? []
          : diagnosisCodesInput.split(",").map(c => c.trim());

      let newEntry: any;

      switch (entryType) {
        case "HealthCheck":
          newEntry = {
            type: "HealthCheck",
            description,
            date,
            specialist,
            healthCheckRating: Number(healthCheckRating),
            diagnosisCodes
          };
          break;
        case "Hospital":
          newEntry = {
            type: "Hospital",
            description,
            date,
            specialist,
            diagnosisCodes,
            discharge: {
              date: dischargeDate,
              criteria: dischargeCriteria
            }
          };
          break;
        case "OccupationalHealthcare":
          newEntry = {
            type: "OccupationalHealthcare",
            description,
            date,
            specialist,
            employerName,
            diagnosisCodes,
            ...(sickLeaveStart && sickLeaveEnd
              ? {
                  sickLeave: {
                    startDate: sickLeaveStart,
                    endDate: sickLeaveEnd
                  }
                }
              : {})
          };
          break;
        default:
          return;
      }

      const created = await patientService.createEntry(id, newEntry);

      setPatient({
        ...patient,
        entries: patient.entries ? [...patient.entries, created] : [created]
      });

      resetForm();
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.data) {
        setError(String(e.response.data));
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Unknown error while adding entry");
      }
    }
  };

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

      <Box mt={3} mb={2} p={2} border="1px dotted #999">
        <Typography variant="h6" gutterBottom>
          New {entryType} entry
        </Typography>

        {error && (
          <Box mb={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <TextField
          variant="standard"
          select
          label="Entry type"
          fullWidth
          margin="dense"
          SelectProps={{ native: true }}
          value={entryType}
          onChange={e =>
            setEntryType(
              e.target.value as
                | "HealthCheck"
                | "Hospital"
                | "OccupationalHealthcare"
            )
          }
        >
          <option value="HealthCheck">HealthCheck</option>
          <option value="Hospital">Hospital</option>
          <option value="OccupationalHealthcare">OccupationalHealthcare</option>
        </TextField>

        <TextField
          variant="standard"
          label="Description"
          fullWidth
          margin="dense"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <TextField
          variant="standard"
          label="Date"
          fullWidth
          margin="dense"
          placeholder="YYYY-MM-DD"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <TextField
          variant="standard"
          label="Specialist"
          fullWidth
          margin="dense"
          value={specialist}
          onChange={e => setSpecialist(e.target.value)}
        />

        {entryType === "HealthCheck" && (
          <TextField
            variant="standard"
            label="Healthcheck rating"
            fullWidth
            margin="dense"
            value={healthCheckRating}
            onChange={e => setHealthCheckRating(e.target.value)}
          />
        )}

        {entryType === "Hospital" && (
          <>
            <TextField
              variant="standard"
              label="Discharge date"
              fullWidth
              margin="dense"
              placeholder="YYYY-MM-DD"
              value={dischargeDate}
              onChange={e => setDischargeDate(e.target.value)}
            />
            <TextField
              variant="standard"
              label="Discharge criteria"
              fullWidth
              margin="dense"
              value={dischargeCriteria}
              onChange={e => setDischargeCriteria(e.target.value)}
            />
          </>
        )}

        {entryType === "OccupationalHealthcare" && (
          <>
            <TextField
              variant="standard"
              label="Employer name"
              fullWidth
              margin="dense"
              value={employerName}
              onChange={e => setEmployerName(e.target.value)}
            />
            <TextField
              variant="standard"
              label="Sick leave start"
              fullWidth
              margin="dense"
              placeholder="YYYY-MM-DD"
              value={sickLeaveStart}
              onChange={e => setSickLeaveStart(e.target.value)}
            />
            <TextField
              variant="standard"
              label="Sick leave end"
              fullWidth
              margin="dense"
              placeholder="YYYY-MM-DD"
              value={sickLeaveEnd}
              onChange={e => setSickLeaveEnd(e.target.value)}
            />
          </>
        )}

        <TextField
          variant="standard"
          label="Diagnosis codes (comma separated)"
          fullWidth
          margin="dense"
          value={diagnosisCodesInput}
          onChange={e => setDiagnosisCodesInput(e.target.value)}
        />

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="secondary"
            onClick={resetForm}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddEntry}
          >
            Add
          </Button>
        </Box>
      </Box>

      <Typography
        variant="h5"
        style={{ marginTop: "1.5em", marginBottom: "0.5em", fontWeight: 600 }}
      >
        entries
      </Typography>

      {patient.entries &&
        patient.entries.map((entry: Entry) => (
          <EntryDetails key={entry.id} entry={entry} />
        ))}
    </div>
  );
};

export default PatientPage;
