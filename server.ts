import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({ apiKey });

  app.post('/api/ai/assistant', async (req, res) => {
    try {
      const { query, country, currency } = req.body;
      if (!apiKey) {
        return res.json({
          response: `EVERY MART AI (Offline Mode): I received your query "${query}". All luxury shipments and verified vendor stores in ${country || 'your country'} are operating smoothly. Browse our premium collection or add funds to your EVERY PAY wallet!`
        });
      }

      const prompt = `You are EVERY MART AI, a friendly, helpful, and fast luxury shopping and logistics assistant for EVERY MART BY SOFT LIFE.
      User's country: ${country || 'Global'}, Currency: ${currency || 'USD'}.
      User query: ${query}
      Provide a concise, helpful, friendly, and royal response. If they are looking for a product or price, suggest relevant items and pricing.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      res.json({ response: response.text || 'Welcome to EVERY MART! How can I assist your shopping today?' });
    } catch (error: any) {
      console.error('AI Assistant Error:', error);
      res.status(500).json({ error: error.message || 'AI assistant failed' });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false }
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EVERY MART BY SOFT LIFE running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
