import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import type { DiaryEntry, NewDiaryEntry, Visibility, Weather } from './types';

const visibilityOptions: Visibility[] = ['great', 'good', 'ok', 'poor'];
const weatherOptions: Weather[] = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy'];

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [newEntry, setNewEntry] = useState<NewDiaryEntry>({
    date: '',
    visibility: 'great',
    weather: 'sunny',
    comment: ''
  });

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/diaries');
        if (!response.ok) {
          throw new Error(`Fetch failed with status ${response.status}`);
        }
        const data = (await response.json()) as DiaryEntry[];
        setDiaries(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      }
    };

    void fetchDiaries();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addDiary = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await axios.post<DiaryEntry>(
        'http://localhost:3000/api/diaries',
        newEntry
      );

      setDiaries(prev => prev.concat(response.data));
      setNewEntry({
        date: '',
        visibility: 'great',
        weather: 'sunny',
        comment: ''
      });
    } catch (e) {
      const err = e as AxiosError;

      if (err.response && typeof err.response.data === 'string') {
        const msg = err.response.data.split('Error: ').at(-1) ?? err.response.data;
        setError(msg);
      } else if (err.response && err.response.data && typeof err.response.data === 'object') {
        const data = err.response.data as { error?: string };
        setError(data.error ?? 'Unknown validation error');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Unknown error when adding diary');
      }
    }
  };

  const formatDate = (isoDate: string) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${year}/${month}/${day}`;
  };

  return (
    <div style={{ padding: '1rem' }}>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <h2>Add new entry</h2>
      <form onSubmit={addDiary}>
        <div>
          date:{' '}
          <input
            type="date"
            name="date"
            value={newEntry.date}
            onChange={handleChange}
          />
        </div>

        <div>
          visibility:{' '}
          {visibilityOptions.map(option => (
            <label key={option} style={{ marginRight: '0.5rem' }}>
              {option}
              <input
                type="radio"
                name="visibility"
                value={option}
                checked={newEntry.visibility === option}
                onChange={handleChange}
              />
            </label>
          ))}
        </div>

        <div>
          weather:{' '}
          {weatherOptions.map(option => (
            <label key={option} style={{ marginRight: '0.5rem' }}>
              {option}
              <input
                type="radio"
                name="weather"
                value={option}
                checked={newEntry.weather === option}
                onChange={handleChange}
              />
            </label>
          ))}
        </div>

        <div>
          comment:{' '}
          <input
            type="text"
            name="comment"
            value={newEntry.comment}
            onChange={handleChange}
          />
        </div>

        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>
      {diaries.map(d => (
        <div key={d.id} style={{ marginBottom: '1rem' }}>
          <h3>{formatDate(d.date)}</h3>
          <p>visibility: {d.visibility}</p>
          <p>weather: {d.weather}</p>
          {d.comment && (
            <p>
              <em>{d.comment}</em>
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;
