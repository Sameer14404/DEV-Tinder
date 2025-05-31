const express= require("express");
const harmainiRouter = express.Router();

const harmainiService = require("../Services/harmainiServices");



harmainiRouter.post("/chat", async (req, res) => {
    
    try {
        const { message } = req.body;
        const userId = req.user._id;
        
        // Process message through our service
        const response = await harmainiService.processMessage(message, userId);
        
        res.json({
            success: true,
            response: response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error processing chat",
            error: error.message
        });
    }
});



exports.harmainiRouter = harmainiRouter;