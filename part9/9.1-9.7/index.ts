import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();
const PORT = 3003;

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  if (
    !height ||
    !weight ||
    isNaN(Number(height)) ||
    isNaN(Number(weight))
  ) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const bmi = calculateBmi(Number(height), Number(weight));

  return res.json({
    weight: Number(weight),
    height: Number(height),
    bmi
  });
});

app.post("/exercises", (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: "parameters missing" });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { daily_exercises, target } = req.body as any;

  if (daily_exercises === undefined || target === undefined) {
    return res.status(400).json({ error: "parameters missing" });
  }

  if (
    !Array.isArray(daily_exercises) ||
    isNaN(Number(target)) ||
    daily_exercises.some((d: unknown) => isNaN(Number(d)))
  ) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const exercises = daily_exercises.map((d: number) => Number(d));
  const result = calculateExercises(exercises, Number(target));

  return res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});