require('dotenv').config();
const OpenAI = require('openai');

const dummyApiKey = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
const openai = new OpenAI({
    apiKey: dummyApiKey
});

const processWithOpenAI = async (message, conversationHistory = []) => {
    const systemPrompt = `You are Harmaini, an expert AI assistant for DevTinder (a developer networking platform).

YOUR CAPABILITIES:
1. Search developers in MongoDB database using natural language
2. Answer ANY technical/programming questions with code examples
3. Provide career advice, best practices, architecture guidance
4. General tech conversation

DATABASE SCHEMA for User collection:
{
    firstName: string,
    lastName: string,
    age: number,
    email: string,
    skills: [string] (array of skills like ["React", "Node.js", "Python"]),
    experienceLevel: "beginner" | "intermediate" | "advanced" | "expert",
    location: string,
    profession: string,
    availability: "full-time" | "part-time" | "freelance" | "unavailable",
    languages: [string],
    interests: [string],
    about: string
}

RESPONSE FORMAT (Always return valid JSON):
{
    "intent": "DATABASE_QUERY" | "TECHNICAL_HELP" | "GENERAL",
    "mongoQuery": {
        // For searching in arrays like skills, use:
        // "skills": ["React", "Node.js"] - this will be converted to proper regex
        // For string fields, use:
        // "location": "Mumbai"
        // "experienceLevel": "expert"
    },
    "response": "Your helpful response",
  
  
}

IMPORTANT: For skills array, just provide the skill names as an array, NOT regex objects.`;

    try {
        const messages = [
            { role: "system", content: systemPrompt },
            ...conversationHistory,
            { role: "user", content: message }
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            response_format: { type: "json_object" },
            temperature: 0.7,
            max_tokens: 1000
        });

        const response = JSON.parse(completion.choices[0].message.content);
        
        // Ensure mongoQuery uses proper format
        if (response.mongoQuery && response.intent === 'DATABASE_QUERY') {
            response.mongoQuery = convertToProperQuery(response.mongoQuery);
        }
        
        return response;
    } catch (error) {
        console.error("OpenAI Error:", error);
        throw error;
    }
};

// Fixed helper function for MongoDB queries
const convertToProperQuery = (query) => {
    const converted = {};
    
    // List of array fields in your schema
    const arrayFields = ['skills', 'languages', 'interests'];
    
    for (const [key, value] of Object.entries(query)) {
        if (arrayFields.includes(key)) {
            // For array fields, use $in with regex
            if (Array.isArray(value)) {
                converted[key] = { 
                    $in: value.map(v => new RegExp(v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'))
                };
            } else if (typeof value === 'string') {
                // Single value for array field
                converted[key] = new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            } else {
                converted[key] = value;
            }
        } else {
            // For non-array fields (strings), use regex directly
            if (typeof value === 'string') {
                converted[key] = { $regex: value, $options: 'i' };
            } else {
                converted[key] = value;
            }
        }
    }
    
    return converted;
};

module.exports = { processWithOpenAI };