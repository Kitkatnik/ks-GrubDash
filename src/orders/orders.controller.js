const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

function create (req, res, next){
    return "yes"
}

function read (req, res, next){
    return "yes"
}

function update (req, res, next){
    return "yes"
}

function destroy (req, res, next){
    return "yes"
}

function list (req, res, next){
    return res.json({ data: orders })
}

module.exports = {
    create: [create],
    read: [read],
    update: [update],
    delete: [destroy],
    list
}
