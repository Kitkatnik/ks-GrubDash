const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

function bodyHasData(property) {
    return function (req, res, next){
        const {data} = req.body;
        const currDish = data[property];

        if (property === "price" && currDish <= 0) {
                return next({
                status: 400,
                message: `Missing ${property}. Please fill in all the fields.`
            })
        }
        if(!currDish || currDish === "") {
            return next({
                status: 400,
                message: `Missing ${property}. Please fill in all the fields.`
            })
        }
        return next();
    }
}

function create (req, res, next){
    const { data: { name, description, price, image_url } = {}} = req.body;
    const id = nextId();
    const newDish = {
        name,
        description,
        price,
        image_url,
        id
    }

    dishes.push(newDish)
    res.status(201).json({ data: newDish})
}

function dishExists (req, res, next){
    return next();
}

function read (req, res, next){
    return next();
}

function update (req, res, next){
    return next();
}

function destroy (req, res, next){
    return next();
}

function list (req, res, next){
    res.json({ data: dishes });
}

module.exports = {
    create: [
        bodyHasData("name"), 
        bodyHasData("description"), 
        bodyHasData("price"), 
        bodyHasData("image_url"), 
        create
    ],
    read: [dishExists, read],
    update: [dishExists, bodyHasData("name"), update],
    delete: [dishExists, destroy],
    list
}