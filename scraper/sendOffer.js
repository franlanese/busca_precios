require('dotenv').config();

async function sendOffer(offer) {
    const baseUrl = process.env.API_URL

    await fetch(`${baseUrl}/newOffer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(offer)
    })
};

module.exports = sendOffer