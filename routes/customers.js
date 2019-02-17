const errors = require('restify-errors');
const Customer = require('../models/Customer');
module.exports = server => {
    //GET ALL Customers
    server.get('/customers', async (req, res, next)=>{
        try{
            const customers = await Customer.find({});
            res.send(customers);
            next();
        } catch(err){
            return next(new errors.InvalidContentError(err));
        }
        
    });
    //Single Customer
    server.get('/customers/:id', async (req, res, next)=>{
        try{
            const customers = await Customer.findById(req.params.id);
            res.send(customers);
            next();
        } catch(err){
            return next(new errors.ResourceNotFoundError(`${req.params.id} not found`));
        }
        
    });
    //ADD Customer
    server.post('/customers', async (req, res, next)=>{
        //Check JSON
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }

        const {name, email, balance} = req.body;

        const customer = new Customer({
            name,
            email,
            balance
        });
        try{
            const newCustomer = await customer.save();
            res.send(201);
            next();
        }catch(err){
            return next(new errors.InternalError(error.message));
        }
    });

    //Update Customer
    server.put('/customers/:id', async (req, res, next)=>{
        //Check JSON
        if(!req.is('application/json')){
            return next(new errors.InvalidContentError("Expects 'application/json'"));
        }
        try{
            const customer = await Customer.findOneAndUpdate({_id: req.params.id}, req.body);
            res.send(200);
            next();
        }catch(err){
            return next(new errors.ResourceNotFoundError(`${req.params.id} not found`));
        }
    });

    //Delete Customer
    server.del('/customers/:id', async (req, res, next)=>{
        try{
            const customer = await Customer.findByIdAndRemove({_id:req.params.id})
            res.send(204);
            next();
        }catch(err){
            return next(new errors.ResourceNotFoundError(`${req.params.id} not found`));
        }
    });
};