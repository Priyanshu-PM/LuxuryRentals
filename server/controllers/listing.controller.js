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

const deleteListing = async (req, res, next) => {

    console.log("api route hitting")
    const listing = await Listing.findById(req.params.id);

    if(!listing) {
        return res.status(404).json({"message": "Listing not found"});
    }
    if(req.user.id != listing.userRef) {
        return res.status(401).json({"message": "You can only delete your own listing"});
    }
    try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({"message": "Listing has been deleted"});

    } catch (error) {
        next(error);
        
    }
};

module.exports = {
    createListing,
    deleteListing,
};