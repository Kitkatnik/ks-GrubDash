const { response } = require("express");
const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

function bodyHasData(property){
    return function (req, res, next){
        const { data } = req.body;
        const currProp = data[property];

        if(property === "id"){
            if(currProp){
                if(currProp != req.params.orderId){
                    next({
                        status: 400,
                        message: `Order id does not match route id. Order id: ${currProp}, Route: ${req.params.orderId}`
                    })
                }
            }
            return next();
        }

        if(property === "status"){
            if( !currProp ||  currProp === "" || currProp === "invalid"){
                return next({
                    status: 400,
                    message: `Missing ${property}. Please fill in all the fields.`
                })
            }
        }

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
    const { orderId } = req.params;
    const foundOrder = orders.find(order => order.id === orderId);
    if(foundOrder){
        res.locals.order = foundOrder;
        return next();
    }
    return next({
        status: 404,
        message: `Order ${orderId} does not exist`
    });
}

function read (req, res, next){
    res.json({ data: res.locals.order })
}

function update (req, res, next){
    const order = res.locals.order;
    if( order.status === "delivered"){
        return next({
            status: 400,
            message: "Order delivered."
        })
    }
    const { data: {deliverTo, mobileNumber, status, dishes }} = req.body;


    order.deliverTo = deliverTo;
    order.mobileNumber = mobileNumber;
    order.status = status;
    order.dishes = dishes;

    res.json({data: order})
}

function destroy (req, res, next){
    const foundOrder = res.locals.order;
    if(foundOrder.status !== "pending"){
        next({
            status: 400,
            message: "A pending order cannot be deleted."
        })
    }
    const index = orders.findIndex( order => order.id == foundOrder.id);
    if(index > -1){
        orders.splice(index, 1);
    }
    res.sendStatus(204)
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
    update: [
        orderExists,
        bodyHasData("deliverTo"),
        bodyHasData("mobileNumber"),
        bodyHasData("dishes"),
        bodyHasData("status"),
        bodyHasData("id"),
        update
    ],
    delete: [orderExists, destroy],
    list
}
