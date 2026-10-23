const connect = require("./db");
const mongoose = require("mongoose");
const Event = require("./models/Event");
const { formatValidationError } = require("./utils/formatError");

(async () => {
  try {
    await connect();
    const validEvent = await Event.create({
      title: "Campus Tech Meetup",
      date: new Date("2026-11-05T00:00:00.000Z"),
      category: "tech",
      capacity: 30,
      fee: 0,
    });
    console.log("Saved event:", validEvent.toObject());

    const invalidEvent = new Event({
      title: " ",
      date: "not-a-date",
      category: "cultural",
      capacity: 201,
      fee: -1,
    });
    try {
      await invalidEvent.save();
    } catch (err) {
      if (!(err instanceof mongoose.Error.ValidationError)) throw err;
      console.log(JSON.stringify(formatValidationError(err), null, 2));
    }
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
