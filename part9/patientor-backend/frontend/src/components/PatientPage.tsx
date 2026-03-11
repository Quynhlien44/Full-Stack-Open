import axios from "axios";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText
} from "@mui/material";

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

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  // common fields
  const [entryType, setEntryType] = useState<EntryType>("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  // HealthCheck
  const [healthCheckRating, setHealthCheckRating] = useState("");

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
    setDiagnosisCodes([]);
    setHealthCheckRating("");
    setDischargeDate("");
    setDischargeCriteria("");
    setEmployerName("");
    setSickLeaveStart("");
    setSickLeaveEnd("");
    setError(null);
  };

  const handleAddEntry = async () => {
    try {
      let newEntry: any;

      switch (entryType) {
        case "HealthCheck":
          newEntry = {
            type: "HealthCheck",
            description,
            date,
            specialist,
            diagnosisCodes,
            healthCheckRating: Number(healthCheckRating)
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
            diagnosisCodes,
            employerName,
            sickLeave:
              sickLeaveStart && sickLeaveEnd
                ? { startDate: sickLeaveStart, endDate: sickLeaveEnd }
                : undefined
          };
          break;

        default:
          return assertNever(entryType as never);
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
          New entry
        </Typography>

        {error && (
          <Box mb={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <TextField
          select
          variant="standard"
          label="Entry type"
          fullWidth
          margin="dense"
          value={entryType}
          onChange={e => setEntryType(e.target.value as EntryType)}
        >
          <MenuItem value="HealthCheck">HealthCheck</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">
            OccupationalHealthcare
          </MenuItem>
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
          type="date"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
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
        <FormControl
          variant="standard"
          fullWidth
          margin="dense"
        >
        <InputLabel id="diagnosis-label">Diagnosis codes</InputLabel>
        <Select
            labelId="diagnosis-label"
            multiple
            value={diagnosisCodes}
            onChange={e =>
                setDiagnosisCodes(e.target.value as string[])
            }
            renderValue={selected => (selected as string[]).join(", ")}
        >
        {diagnoses.map(d => (
            <MenuItem key={d.code} value={d.code}>
                <Checkbox checked={diagnosisCodes.indexOf(d.code) > -1} />
                <ListItemText primary={`${d.code} ${d.name}`} />
            </MenuItem>
        ))}
        </Select>
        </FormControl>

        {entryType === "HealthCheck" && (
        <FormControl
          variant="standard"
          fullWidth
          margin="dense"
        >
        <InputLabel id="rating-label">Healthcheck rating</InputLabel>
        <Select
            labelId="rating-label"
            value={healthCheckRating}
            onChange={e => setHealthCheckRating(e.target.value as string)}
        >
        <MenuItem value="0">0 - Healthy</MenuItem>
        <MenuItem value="1">1 - Low risk</MenuItem>
        <MenuItem value="2">2 - High risk</MenuItem>
        <MenuItem value="3">3 - Critical risk</MenuItem>
        </Select>
        </FormControl>
        )}

        {entryType === "Hospital" && (
          <>
            <TextField
              variant="standard"
              label="Discharge date"
              type="date"
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
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
              type="date"
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              value={sickLeaveStart}
              onChange={e => setSickLeaveStart(e.target.value)}
            />
            <TextField
              variant="standard"
              label="Sick leave end"
              type="date"
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              value={sickLeaveEnd}
              onChange={e => setSickLeaveEnd(e.target.value)}
            />
          </>
        )}

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
