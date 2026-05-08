const stopWords = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'have', 'has', 'are', 'was', 'were', 'will', 'shall',
  'must', 'should', 'can', 'will', 'your', 'you', 'our', 'their', 'they', 'them', 'theyre', 'them', 'about',
  'in', 'on', 'to', 'of', 'a', 'an', 'or', 'as', 'by', 'at', 'be', 'is', 'it', 'its', 'we', 'us', 'if', 'but',
  'not', 'no', 'so', 'all', 'any', 'may', 'such', 'into', 'has', 'had', 'than', 'these', 'those', 'other'
]);

function normalizeWords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token && token.length >= 4 && !stopWords.has(token));
}

function extractKeywords(text) {
  const tokens = normalizeWords(text);
  const frequency = new Map();

  tokens.forEach((token) => {
    frequency.set(token, (frequency.get(token) || 0) + 1);
  });

  return Array.from(frequency.keys()).slice(0, 40);
}

function buildSummary(score) {
  if (score >= 85) return 'Highly recommended for immediate interview.';
  if (score >= 70) return 'Strong candidate; schedule a technical interview.';
  if (score >= 55) return 'Consider for follow-up screening.';
  return 'Low fit; reject or keep for a later role.';
}

function gradeFromScore(score) {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

function salaryRange(score) {
  if (score >= 85) return '$95k - $130k';
  if (score >= 70) return '$75k - $95k';
  if (score >= 55) return '$60k - $75k';
  if (score >= 40) return '$45k - $60k';
  return '$35k - $50k';
}

function getVerdict(score) {
  if (score >= 85) return 'Highly Recommended';
  if (score >= 70) return 'Consider';
  if (score >= 55) return 'Phone Screen';
  return 'Reject';
}

function analyzeResumes(jobDescription, resumes) {
  const keywords = extractKeywords(jobDescription);

  return resumes.map((resume) => {
    const resumeText = (resume.text || '').toLowerCase();
    const normalizedJob = keywords;
    const matched = normalizedJob.filter((keyword) => resumeText.includes(keyword));
    const missing = normalizedJob.filter((keyword) => !resumeText.includes(keyword));
    const baseScore = normalizedJob.length === 0 ? 0 : Math.round((matched.length / normalizedJob.length) * 100);
    const extraPoints = Math.min(10, Math.floor((matched.length / (normalizedJob.length || 1)) * 10));
    const score = Math.min(100, baseScore + extraPoints);

    const matchedSkills = Array.from(new Set(matched)).slice(0, 8);
    const missingSkills = Array.from(new Set(missing)).slice(0, 8);
    const riskTriggers = [];

    if (score < 50) {
      riskTriggers.push('Low relevance to the job description');
    }
    if (missingSkills.length >= 5) {
      riskTriggers.push('Missing several required keywords/skills');
    }
    if (resumeText.includes('intern') && score < 60) {
      riskTriggers.push('More junior experience than the role requires');
    }

    return {
      name: resume.name || 'Unnamed Candidate',
      score,
      grade: gradeFromScore(score),
      verdict: getVerdict(score),
      interviewRecommendation: buildSummary(score),
      salaryEstimate: salaryRange(score),
      strengths: matchedSkills,
      gaps: missingSkills,
      redFlags: riskTriggers,
      summary: `Matched ${matchedSkills.length} of ${normalizedJob.length} key terms.`,
      raw: resume,
    };
  }).sort((a, b) => b.score - a.score);
}

export { analyzeResumes };
