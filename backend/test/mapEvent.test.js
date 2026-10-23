const test = require("node:test");
const assert = require("node:assert");
const mapEventDocument = require("../utils/mapEvent");

test("Mongo event documents map to the event card fields", () => {
  const mapped = mapEventDocument({
    _id: "event-id",
    title: "CHARUSAT TechFest 2026",
    date: new Date("2026-11-05T00:00:00.000Z"),
    category: "tech",
    fee: 250,
    capacity: 120,
    durationMin: 180,
  });

  assert.deepStrictEqual(mapped, {
    id: "event-id",
    title: "CHARUSAT TechFest 2026",
    date: new Date("2026-11-05T00:00:00.000Z"),
    category: "tech",
    fee: 250,
    durationMin: 180,
    seatsLeft: 120,
  });
});

test("Mongo event mapping preserves zero seats and leaves missing duration unspecified", () => {
  const mapped = mapEventDocument({ _id: "full-event", title: "Full event", seatsLeft: 0 });
  assert.strictEqual(mapped.seatsLeft, 0);
  assert.strictEqual(mapped.durationMin, null);
  assert.strictEqual(mapped.fee, 0);
});

test("Mongo extended JSON dates are normalized for the React date formatter", () => {
  const mapped = mapEventDocument({
    _id: "extended-date",
    title: "CHARUSAT TechFest 2026",
    date: { $date: "2026-12-15T10:00:00.000Z" },
  });
  assert.strictEqual(mapped.date, "2026-12-15T10:00:00.000Z");
});
