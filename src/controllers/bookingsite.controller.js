const BookingSite = require("../models/bookingsite.model");
const User = require("../models/user.model");

module.exports = {

    //GET -READ
    async list(req, res){
        try{
            const bookingSites = await BookingSite.find();
            res.status(200).json({ message: "Booking Sites found", data: bookingSites });
        } catch (err){
            res.status(500).json(err);
        }
    },
    //show ID
    async show (req, res){
        try{
            const { bookingSiteId } = req.params;
            
            const bookingSite= await BookingSite.findById(bookingSiteId).populate({
                path: "user",
                select : "name lastname",
            });
            res.status(200).json({ message: "Booking Site found", data: bookingSite });
        }catch (err){
            res.status(404).json(err);
        }
    },

    //Create -POST
    async create(req,res){
        try{
            const id = req.user;
            const user = await User.findById(id);

            if(!user){
                throw new Error("Invalid user");
            }

        const bookingsite = await BookingSite.create({...req.body, user: user})
        user.bookingsites.push(bookingsite);
        await user.save({validateBeforeSave:false});
        res.status(201).json({ message: "Booking Site created", data: bookingsite });
        console.log("aquiesta:", res.secure_url)
    }catch (err) {
        res.status(400).json(err);
    }
    },
    //Update PUT
    async update(req, res){
        try{
            const { bookingSiteId } = req.params;
            const bookingSite= await BookingSite.findByIdAndUpdate(bookingSiteId, req.body, { new: true, runValidators: true, context: 'query' });
            res.status(200).json({ message: "Booking Site updated", data: bookingSite });
        }catch(err){
            res.status(404).json(err);
        }
    },
    //Delete
    async destroy(req, res) {
        try{
        const { bookingSiteId } = req.params;
        const bookingSite= await BookingSite.deleteOne({_id: bookingSiteId});
        res.status(200).json({ message: "Booking Site deleted", data: bookingSite });
    }catch(err){
        res.status(404).json(err);
        };
    },
}