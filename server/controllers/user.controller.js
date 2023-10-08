const test = (req, res) => {
    res.json({
        "message": "Hello from backend"
    });
};

module.exports = { test };