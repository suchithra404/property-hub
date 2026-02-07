import Contact from "../models/contact.model.js";

// Save message
export const sendMessage = async (req, res) => {
  try {
    const { name, email, message, staff } = req.body;

    const newMessage = new Contact({
      name,
      email,
      message,
      staff,

      // ⭐ only if logged in
      user: req.user?.id || null,
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

export const getMyMessages = async (req, res) => {
  try {
    const messages = await Contact.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(messages);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};



// Get all messages (Admin)
export const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json(messages);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};
