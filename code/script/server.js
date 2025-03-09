import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import the CORS package

// Load environment variables
dotenv.config({ path: "../../.env" });

// Configuration
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const generationConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 4096,
};

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig });

// Set up Express server
const app = express();
app.use(express.json()); // Parse incoming JSON requests

// Enable CORS for all origins
app.use(cors());  // Use CORS middleware to allow all origins by default

// Endpoint to generate content from Gemini
async function generateContent(prompt) {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Error generating content:", error);
        return "Error generating content.";
    }
}

app.post("/generate", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
    }
    const content = await generateContent(prompt);
    res.json({ content });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
