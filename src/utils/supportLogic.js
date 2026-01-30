
const FAQ = [
    {
        keywords: ["buy", "purchase", "how to buy"],
        answer: "To buy a car, simply browse our 'Buy Car' section, select a car you like, and click 'Schedule Test Drive'. Our team will handle all the paperwork for you!"
    },
    {
        keywords: ["sell", "sell my car", "valuation"],
        answer: "Selling is easy! Go to the 'Sell Car' page, fill in your car details, and upload photos. We'll give you a fair valuation and find a buyer quickly."
    },
    {
        keywords: ["certified", "VroomValue certified", "warranty"],
        answer: "VroomValue Certified cars undergo a 200-point inspection and come with a 12-month warranty for complete peace of mind."
    },
    {
        keywords: ["location", "office", "where are you", "city"],
        answer: "Our main office is in **Ahmedabad, Gujarat**. We offer doorstep test drives and deliveries across all major Indian cities!"
    },
    {
        keywords: ["price", "budget", "emi", "finance"],
        answer: "We have cars for every budget, from ₹3 Lakhs to ₹50 Lakhs. We also offer easy EMI options with leading banks."
    }
];

export const getSupportAnswer = (message) => {
    const msg = message.toLowerCase();

    // Try to find a match in FAQ
    const match = FAQ.find(item =>
        item.keywords.some(keyword => msg.includes(keyword))
    );

    if (match) return match.answer;

    // Default polite response if no specific match
    return "That's a great question! I'm still learning, but you can definitely find more details in our 'Buy' or 'Sell' sections. Or just ask about 'how to buy' or 'certified cars'!";
};
