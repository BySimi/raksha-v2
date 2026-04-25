let emergencyLog = [];

export function addToLog(text) {
    if (!text) return;
    emergencyLog.push(text);
}

export async function generateSummary() {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
        return '⚠️ No API key found. Add VITE_GROQ_API_KEY to your .env file.';
    }

    if (emergencyLog.length === 0) {
        return '⚠️ No emergency data logged yet. Describe your emergency in the chat first.';
    }

    const prompt = `Convert this emergency data into a short report for paramedics.

Rules:
- Max 3 bullet points
- Very short and clear
- No explanation

Data:
${emergencyLog.join(", ")}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }]
        })
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
        return '⚠️ AI failed to generate summary. Try again.';
    }

    return data.choices[0].message.content;
}
