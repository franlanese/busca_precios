async function sendOffer(offer) {
    await fetch('http://localhost:4500/newOffer', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(offer)
    })
};

module.exports = sendOffer