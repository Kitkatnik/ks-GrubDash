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
        if (property === "price" && typeof currDish !== "number") {
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
    const { dishId } = req.params;

    const foundDish = dishes.find( dish => dish.id == dishId );

    if(foundDish){
        res.locals.dish = foundDish;
        return next();
    }
    return next({
        status: 404,
        message: `Dish does not exist: ${dishId}`
    })
}

function read (req, res, next){
    res.json({ data: res.locals.dish })
}

function update (req, res, next){
    const dish = res.locals.dish;
    const { data: { id, name, description, price, image_url } = {} } = req.body;

        if(id && id != dish.id){
            return next({
                status: 400,
                message: `Dish id does not match route id. Dish: ${id}, Route: ${dish.id}`
            })
        }

        dish.name = name;
        dish.description = description;
        dish.price = price;
        dish.image_url = image_url;

        res.json({ data: dish })
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
    update: [
        dishExists, 
        bodyHasData("name"), 
        bodyHasData("description"), 
        bodyHasData("price"), 
        bodyHasData("image_url"), 
        update
    ],
    delete: [dishExists, destroy],
    list
}