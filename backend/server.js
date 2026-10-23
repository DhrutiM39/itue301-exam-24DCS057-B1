const connect = require("./db");
const app = require("./app");
const PORT = process.env.PORT || 5000;

connect()
  .then(() => app.listen(PORT, () => console.log(`EventHub API running on port ${PORT}`)))
  .catch(() => {
    console.error("MongoDB connection failed. Check that MongoDB is running and MONGO_URI points to the eventhub database.");
    process.exitCode = 1;
  });
