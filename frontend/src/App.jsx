import { useMemo, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = pdfjsWorker;

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');

const defaultJobDescription = `We are hiring a Software Engineer with 4+ years of experience building REST APIs, microservices, backend systems, and cloud infrastructure. The candidate must know Node.js, Express, TypeScript, SQL, AWS, and automation testing. Strong communication and teamwork skills are required.`;

async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  let text = '';

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(' ') + '\n\n';
  }

  return text;
}

function App() {
  const [jobDescription, setJobDescription] = useState(defaultJobDescription);
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canRun = useMemo(() => jobDescription.trim() && candidates.length > 0, [jobDescription, candidates]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF resume only.');
      return;
    }

    setError('');
    setLoading(true);
    setResults([]);

    try {
      const text = await extractPdfText(file);
      setCandidates([{ name: file.name, text: text.slice(0, 12000) }]);
    } catch (uploadError) {
      setError('Unable to parse the PDF file. Please try another resume.');
    } finally {
      setLoading(false);
      event.target.value = null;
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/filter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resumes: candidates }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || 'Unable to analyze resumes');
      }

      const data = await response.json();
      setResults(data.results.slice(0, 1));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="navbar">
        <div className="brand">Resume Filter</div>
        <nav>
          <a href="#upload">Upload</a>
          <a href="#job">Job</a>
          <a href="#result">Result</a>
        </nav>
      </header>

      <div className="hero animated-hero">
        <div className="hero-decorations">
          <span className="blob blob-1" />
          <span className="blob blob-2" />
          <span className="blob blob-3" />
          <span className="blob blob-4" />
        </div>
        <div className="hero-copy">
          <h1>PDF Resume Filter</h1>
          <p>Upload one PDF resume, then match it to your job description quickly and beautifully.</p>
        </div>
        <div className="hero-actions">
          <label className="upload-button" id="upload">
            Upload PDF Resume
            <input type="file" accept=".pdf" onChange={handleUpload} />
          </label>
          <button className={loading ? 'loading' : ''} disabled={!canRun || loading} onClick={handleAnalyze}>
            {loading ? 'Analyzing…' : 'Run Filter'}
          </button>
        </div>
      </div>

      <section id="job" className="job-section">
        <h2>Job Description</h2>
        <div className="job-hint">Highlight your role requirements clearly: skills, experience, tools, and team impact.</div>
        <textarea value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} />
      </section>

      <section id="upload">
        <h2>Uploaded Resume</h2>
        {candidates.length === 0 ? (
          <p className="empty-state">Upload a PDF resume to display its extracted data here.</p>
        ) : (
          <div className="candidate-list">
            <div className="candidate-card highlight-card">
              <strong>{candidates[0].name}</strong>
              <p>{candidates[0].text.slice(0, 260)}{candidates[0].text.length > 260 ? '…' : ''}</p>
            </div>
          </div>
        )}
      </section>

      {error && <div className="notice error">{error}</div>}

      <section id="result">
        <h2>Top Result</h2>
        {results.length === 0 ? (
          <p className="empty-state">No results yet. Click "Run Filter" to analyze candidates.</p>
        ) : (
          <div className="results-grid">
            {results.map((result) => (
              <div key={result.name} className="result-card">
                <div className="result-header">
                  <div>
                    <h3>{result.name}</h3>
                    <p>{result.verdict} · {result.grade}</p>
                  </div>
                  <span className="score-pill">{result.score}%</span>
                </div>
                <p><strong>Interview:</strong> {result.interviewRecommendation}</p>
                <p><strong>Salary estimate:</strong> {result.salaryEstimate}</p>
                <p>{result.summary}</p>
                <div className="progress-wrapper">
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${result.score}%` }} />
                  </div>
                  <span className="progress-label">Match Score: {result.score}%</span>
                </div>
                <div className="resume-tip">
                  <strong>What to include in your resume:</strong> {result.gaps.length > 0 ? result.gaps.slice(0, 4).join(', ') : 'Focus on your core competencies and accomplishments relevant to the job.'}
                </div>
                <div className="chip-row">
                  {result.strengths.map((skill) => <span key={skill} className="chip positive">{skill}</span>)}
                </div>
                <div className="chip-row">
                  {result.gaps.map((skill) => <span key={skill} className="chip negative">Missing: {skill}</span>)}
                </div>
                {result.redFlags.length > 0 && (
                  <div className="warning-box">
                    <strong>Red flags:</strong>
                    <ul>
                      {result.redFlags.map((flag) => <li key={flag}>{flag}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
