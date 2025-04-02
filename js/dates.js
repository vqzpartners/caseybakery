// Configuration for all bakery drop delivery dates
const dropDeliveryDates = [
    {
        id: 1,
        date: "2025-04-16T00:00:00", // Format: "YYYY-MM-DDThh:mm:ss"
        dropIds: [1, 2], // References to drops in drops.js by their IDs
        status: "confirmed" // "confirmed" or "tentative"
    },
    {
        id: 2,
        date: "2025-05-01T00:00:00",
        dropIds: [],
        status: "confirmed"
    }
];
