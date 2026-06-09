const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    console.log("Received:", JSON.stringify(req.body).slice(0, 200));
    const { messages } = req.body;
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log("Groq status:", response.status);
    console.log("Groq reply:", JSON.stringify(data).slice(0, 200));

    if (!response.ok) {
      return res.status(400).json({ error: data.error?.message || 'Groq error' });
    }

    const reply = data.choices?.[0]?.message?.content || "No response";
    res.json({ reply });

  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
