import express from 'express';
import cors from 'cors';
import { analyzeResumes } from './resumeUtils.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

app.post('/api/filter', (req, res) => {
  const { jobDescription, resumes } = req.body;

  if (!jobDescription || !Array.isArray(resumes)) {
    return res.status(400).json({ error: 'Request must include jobDescription and resumes array.' });
  }

  const results = analyzeResumes(jobDescription, resumes);
  res.json({ jobDescription, results });
});

app.listen(port, () => {
  console.log(`Resume filter backend running on http://localhost:${port}`);
});
