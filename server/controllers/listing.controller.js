const Listing = require("../models/Listing.modal");

const createListing = async (req, res, next) => {

    try {
        const listing = await Listing.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Listing has been done",
            data: {listing},
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createListing
};