// Import the PinMessage model
const PinMessage = require("../models/PinMessage");

// Define the controller function
const getPinnedMessages = async (req, res) => {
  try {
    // Fetch pinned messages from the database
    const pinnedMessages = await PinMessage.find();

    // Return the fetched pinned messages as a response
    return res.json(pinnedMessages);
  } catch (error) {
    console.error("Error fetching pinned messages:", error);
    // Handle errors appropriately
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Export the controller function
module.exports = {
  getPinnedMessages,
};
