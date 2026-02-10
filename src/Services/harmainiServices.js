const { processWithOpenAI } = require("../../utils/aiServices");





const User = require("../Models/userModel");

// Store conversation history (in production, use Redis or DB)
const conversationHistory = new Map();

const processMessage = async (message, userId) => {
    try {
        // Get user's conversation history
        const userHistory = conversationHistory.get(userId) || [];
        
        // Get AI response
        const aiResponse = await processWithOpenAI(message, userHistory);
        
        // Update conversation history
        userHistory.push(
            { role: "user", content: message },
            { role: "assistant", content: JSON.stringify(aiResponse) }
        );
        
        // Keep only last 10 messages to avoid token limits
        if (userHistory.length > 20) {
            userHistory.splice(0, 2);
        }
        conversationHistory.set(userId, userHistory);
        
        let finalResponse = {
            message: aiResponse.response,
            intent: aiResponse.intent,
            suggestions: aiResponse.suggestions,
            confidence: aiResponse.confidence
        };
        
        // Handle database queries
        if (aiResponse.intent === 'DATABASE_QUERY' && aiResponse.mongoQuery) {
            try {
                console.log("Executing query:", JSON.stringify(aiResponse.mongoQuery));
                
                const users = await User.find(aiResponse.mongoQuery)
                    .select('firstName lastName skills experienceLevel availability location profession photoUrl about')
                    .limit(10)
                    .lean();
                
                finalResponse.results = users;
                finalResponse.resultCount = users.length;
                finalResponse.query = aiResponse.mongoQuery;
                
                // Create formatted user list
                if (users.length > 0) {
                    const userList = users.map(u => {
                        const skillsStr = u.skills.slice(0, 3).join(', ');
                        return `**${u.firstName} ${u.lastName}**\n- Skills: ${skillsStr}\n- Level: ${u.experienceLevel}\n- Location: ${u.location || 'Not specified'}`;
                    }).join('\n\n');
                    
                    finalResponse.message = `${aiResponse.response}\n\n${userList}`;
                }
                
            } catch (dbError) {
                console.error("Database error:", dbError);
                finalResponse.message = "I understood your query but encountered a database error. " + dbError.message;
                finalResponse.error = dbError.message;
            }
        }
        
        // Add code example if provided
        if (aiResponse.codeExample) {
            finalResponse.codeExample = aiResponse.codeExample;
        }
        
        return finalResponse;
        
    } catch (error) {
        console.error("AI Processing Error:", error);
        
        return {
            message: "I apologize, I'm having trouble processing your request. Please try rephrasing your question.",
            intent: "ERROR",
            error: error.message,
            suggestions: [
                "Try a simpler query",
                "Ask about specific technologies",
                "Search for developers by skill"
            ]
        };
    }
};

// Clear conversation history for a user
const clearHistory = (userId) => {
    conversationHistory.delete(userId);
};




const classifyIntent = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Database query keywords
    const dbKeywords = ['show', 'find', 'search', 'developers', 'users', 'skills', 'filter', 'who have', 'with skill'];
    
    // Technical question keywords
    const techKeywords = ['how to', 'what is', 'why', 'explain', 'error', 'debug', 'help with', 'code'];
    
    // Check for database query intent
    for (let keyword of dbKeywords) {
        if (lowerMessage.includes(keyword)) {
            return 'DATABASE_QUERY';
        }
    }
    
    // Check for technical question intent
    for (let keyword of techKeywords) {
        if (lowerMessage.includes(keyword)) {
            return 'TECHNICAL_QUESTION';
        }
    }
    
    return 'GENERAL_CHAT';
};

module.exports = { processMessage , clearHistory};