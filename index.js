const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Your verify token (use any secure random string)
const VERIFY_TOKEN = "your_verify_token";

// Parse incoming request bodies
app.use(bodyParser.json());

// Webhook verification (GET request)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // Verify token matches
  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403); // Forbidden
  }
});

// Handle webhook events (POST request)
app.post("/webhook", (req, res) => {
  const body = req.body;

  // Check if the event is from a page subscription
  if (body.object === "page") {
    body.entry.forEach((entry) => {
      const webhookEvent = entry.messaging[0];
      console.log("Webhook event received:", webhookEvent);
    });

    // Return a 200 OK response to Facebook
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Return a 404 if the event is not from a page subscription
    res.sendStatus(404);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
