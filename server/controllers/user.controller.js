const test = (req, res) => {
    res.json({
        "message": "Hello from backdrop user"
    });
};

module.exports = { test };