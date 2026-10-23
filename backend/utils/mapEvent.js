function mapEventDocument(document) {
  const storedDate = document.date;
  const date = storedDate && typeof storedDate === "object" && storedDate.$date
    ? storedDate.$date
    : storedDate;

  return {
    id: String(document._id ?? document.id),
    title: document.title,
    date,
    category: document.category,
    fee: document.fee ?? 0,
    durationMin: document.durationMin ?? null,
    seatsLeft: document.seatsLeft ?? document.capacity ?? 0,
  };
}

module.exports = mapEventDocument;
