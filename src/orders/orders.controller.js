const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

function bodyHasData(property){
    return function (req, res, next){
        const { data } = req.body;
        const currProp = data[property];

        if(property === "dishes"){
            if(!Array.isArray(currProp)){
                return next({
                    status: 400,
                    message: `Missing ${property}. Please fill in all the fields.`
                })
            }
            if(currProp.length === 0){
                return next({
                    status: 400,
                    message: `Missing ${property}. Please fill in all the fields.`
                })
            }
            const index = currProp.findIndex( order => {
                return !order.quantity || order.quantity <= 0 || typeof order.quantity !== "number"
            })
            if(index > -1){
                return next({
                    status: 400,
                    message: `Dish ${index} must have a quantity that is an integer greater than 0`
                })
            }
        }
        if( !currProp ||  currProp === ""){
            return next({
                status: 400,
                message: `Missing ${property}. Please fill in all the fields.`
            })
        }
        return next();
    }
}

function create (req, res, next){
    const { data } = req.body;
    const id = nextId();
    const newOrder = {
        ...data,
        id: id
    }
    orders.push(newOrder);
    res.status(201).json({ data: newOrder })
}

function orderExists (req, res, next){
    console.log(req.body)
    return next();
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
    create: [
        bodyHasData("deliverTo"),
        bodyHasData("mobileNumber"),
        bodyHasData("dishes"),
        create
    ],
    read: [orderExists, read],
    update: [update],
    delete: [destroy],
    list
}
