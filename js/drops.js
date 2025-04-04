// Configuration for all bakery drops
const bakeryDrops = [
    // Available drops
    {
        id: 1,
        title: "Cuchareable Maracuya",
        status: "coming-soon", // "available" or "coming-soon"
        image: "img/casey/maracuya.webp", // Will be overridden with mystery image if status is "coming-soon"
        url: "https://cuanto.app/casey/w/6d97e2", // Only used if status is "available"
        releaseDate: "2025-04-05T00:00:00" // Only used if status is "coming-soon" - Format: "YYYY-MM-DDThh:mm:ss"
    },
    {
        id: 2,
        title: "Nutella Cake",
        status: "coming-soon",
        image: "img/casey/nutella-cake.jpg",
        url: "https://cuanto.app/casey/w/4164aa", //
        releaseDate: "2025-04-05T00:00:00"
    },
    
    // Coming soon drops
    {
        id: 3,
        title: "Carrot Cake",
        status: "coming-soon",
        image: "img/casey/carrot.jpg",
        url: "https://cuanto.app/casey/w/3cf3e9",
        releaseDate: "2025-04-05T00:00:00"
    },
    
    // More drops - all without timers
    {
        id: 4,
        title: "Unknown",
        status: "coming-soon",
        image: "", 
        url: "",
        releaseDate: null
    }
];
