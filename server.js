require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const dns = require("dns");

// Force Node to use Google's DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT || 3000;

const requestSchema = new mongoose.Schema({
    name: String,
    location: String,
    help: String
});

const Request = mongoose.model("Request", requestSchema);

const contactSchema = new mongoose.Schema({
    name: String,
    phone: String
});

const Contact = mongoose.model("Contact", contactSchema);

app.use(express.json());
app.use(express.static(__dirname));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((err) => {
    console.error("❌ MongoDB Connection Error:");
    console.error(err);
});

// Save assistance request
app.post("/request", async (req, res) => {

    try {

        const request = new Request(req.body);

        await request.save();

        res.json({
            message: "Request saved successfully!"
        });

    } catch (err) {

        res.status(500).json({
            message: "Error saving request"
        });

    }

});

// Get all requests
app.get("/requests", async (req, res) => {

    const requests = await Request.find();

    res.json(requests);

});

// Save emergency contact
app.post("/contact", async (req, res) => {

    const contact = new Contact(req.body);

    await contact.save();

    res.json({
        message: "Emergency contact saved!"
    });

});

// Get all contacts
app.get("/contacts", async (req, res) => {

    const contacts = await Contact.find();

    res.json(contacts);

});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});