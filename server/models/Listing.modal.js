const express = require('express')
const mongoose = require('mongoose')
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const listingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    regularPrice: {
        type: Number,
        required: true,
    },
    discountedPrice: {
        type: Number,
        required: true,
    },
    bathrooms: {
        type: Number,
        required: true,
    },
    bedrooms: {
        type: Number,
        required: true,
    },
    furnished: {
        type: Boolean,
        required: true,
    },
    parking: {
        type: Boolean,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    offer: {
        type: Boolean,
        required: true,
    },
    imageURLs: {
        type: Array,
        required: true,
    },
    userRef: {
        type: String,
        required: true,
    }

}, {timestamps: true}
);

module.exports = mongoose.model("Listing", listingSchema);