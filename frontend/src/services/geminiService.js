export async function generateGeminiResponse(message) {
    const res = await fetch('http://localhost:4000/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    return data.reply;
  }