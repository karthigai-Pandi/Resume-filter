import { analyzeResumes } from '../backend/resumeUtils.js';

function readBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  if (typeof req.body === 'string') {
    return JSON.parse(req.body);
  }

  return {};
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const { jobDescription, resumes } = readBody(req);

    if (!jobDescription || !Array.isArray(resumes)) {
      return res.status(400).json({ error: 'Request must include jobDescription and resumes array.' });
    }

    const results = analyzeResumes(jobDescription, resumes);
    return res.status(200).json({ jobDescription, results });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid request body.' });
  }
}
