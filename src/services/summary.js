let emergencyLog = [];

// Add important points
export function addToLog(text) {
    if (!text) return;
    emergencyLog.push(text);
}

// Generate summary using AI
export async function generateSummary() {
    const prompt = `
Convert this emergency data into a short report for paramedics.

Rules:
- Max 3 bullet points
- Very short and clear
- No explanation

Data:
${emergencyLog.join(", ")}
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer YOUR_API_KEY`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}