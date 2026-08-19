import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { analyzeResumeWithGemini } from './services/geminiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
// Serve React/Vite production frontend
const frontendPath = path.join(process.cwd(), 'dist');

app.use(express.static(frontendPath));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isAiConfigured = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here');

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiAvailable: isAiConfigured,
    message: isAiConfigured
      ? 'Express server active with Gemini AI backend connected.'
      : 'Express server active in Local Deterministic Mode (GEMINI_API_KEY not set).'
  });
});

// AI Semantic Analysis Endpoint
app.post('/api/analyze-ai', async (req, res) => {
  try {
    const { resumeText, sections, jobDescription } = req.body;

    if (!resumeText || typeof resumeText !== 'string') {
      res.status(400).json({ error: 'Missing or invalid resumeText parameter.' });
      return;
    }

    const aiResult = await analyzeResumeWithGemini({
      resumeText,
      sections: sections || {},
      jobDescription: jobDescription || '',
    });

    res.json({
      success: true,
      data: aiResult,
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-ai:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while processing AI analysis.',
    });
  }
});

// React SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Smart Resume Analyzer Backend listening on http://localhost:${PORT}`);
  console.log(`AI Engine Available: ${Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'f122d42010bf79e801eba37f8c26eb22')}`);
});
