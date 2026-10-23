const express = require("express");
const mongoose = require("mongoose");
const Event = require("./models/Event");
const mapEventDocument = require("./utils/mapEvent");
const app = express();

// Request logger: [METHOD] [PATH] [TIMESTAMP]
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path} [${new Date().toISOString()}]`);
  next();
});
app.use(express.json());

// MongoDB-backed catalog used by the React event listing. The in-memory
// /api/v1/events service below remains available for the exam API tasks.
app.get("/api/v1/catalog/events", async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "MongoDB is not connected" });
  }

  try {
    const documents = await Event.find({}).sort({ date: 1, _id: 1 }).lean().exec();
    res.status(200).json(documents.map(mapEventDocument));
  } catch (err) {
    next(err);
  }
});

let events = [
  { id: 1, title: "Hack Night", capacity: 30, fee: 100 },
  { id: 2, title: "Open Mic", capacity: 50, fee: 0 },
  { id: 3, title: "Robotics Expo", capacity: 80, fee: 250 },
];
let nextId = 4;

app.get("/api/v1/events", (req, res) => {
  if (req.query.maxFee === undefined) return res.status(200).json(events);
  const maxFee = Number(req.query.maxFee);
  if (!Number.isFinite(maxFee) || maxFee < 0) {
    return res.status(400).json({ error: "maxFee must be a non-negative number" });
  }
  res.status(200).json(events.filter((event) => event.fee <= maxFee));
});

app.get("/api/v1/events/:id", (req, res) => {
  const event = events.find((e) => e.id === Number(req.params.id));
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.status(200).json(event);
});

app.post("/api/v1/events", (req, res) => {
  const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const { capacity } = body;
  const fee = body.fee === undefined ? 0 : body.fee;
  if (title.length < 1 || title.length > 80) {
    return res.status(400).json({ error: "title must be 1 to 80 characters" });
  }
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 500) {
    return res.status(400).json({ error: "capacity must be a whole number from 1 to 500" });
  }
  if (typeof fee !== "number" || !Number.isFinite(fee) || fee < 0) {
    return res.status(400).json({ error: "fee must be a non-negative number" });
  }
  const event = { id: nextId++, title, capacity, fee };
  events.push(event);
  res.status(201).json(event);
});

app.delete("/api/v1/events/:id", (req, res) => {
  const index = events.findIndex((event) => event.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Event not found" });
  const [deletedEvent] = events.splice(index, 1);
  res.status(200).json(deletedEvent);
});

// Diagnostic route used to test the error handler. Leave it in place.
app.get("/api/v1/boom", () => {
  throw new Error("Stage collapsed");
});

// Global error handler
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Something went wrong" });
});

module.exports = app;
