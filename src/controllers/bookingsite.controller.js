const BookingSite = require("../models/bookingsite.model");

module.exports = {

    //GET -READ
    list(req, res){
        BookingSite.find()
        .then((bookingSites) => {
            res.status(200).json({ message: "Booking Sites found", data: bookingSites });
        })
        .catch((err) => {
            res.status(404).json({ message: "Booking Site not found" });
        });
    },
    //show ID
    show(req, res) {
        const { bookingSiteId } = req.params;
    
        BookingSite.findById(bookingSiteId)
        .then((bookingSite) => {
            res.status(200).json({ message: "Booking Site found", data: bookingSite });
        })
        .catch((err) => {
            res.status(404).json({ message: "Booking Site not found" });
        });
    },


    //Create -POST
    create(req,res){
        const data =req.body;
        const newBookingSite = {
            ...data,
            
        };

        BookingSite.create(newBookingSite)
        .then((bookingSite) => {
            res.status(201).json({ message: "Booking Site created", data: bookingSite });
        })
        .catch((err) => {
            res
            .status(400)
            .json({ message: "Booking Site could not be created", data: err });
        });
    },
    //Update PUT
    update(req, res){
        const { bookingSiteId } = req.params;

    BookingSite.findByIdAndUpdate(bookingSiteId, req.body, { new: true })
    .then((bookingSite) => {
        res.status(200).json({ message: "Booking Site updated", data: bookingSite });
    })
    .catch((err) => {
        res
        .status(400)
        .json({ message: "Booking Site could not be updated", data: err });
    });
    },
    //Delete
    destroy(req, res) {
        const { bookingSiteId } = req.params;
        
        BookingSite.findByIdAndDelete(bookingSiteId)
        .then((bookingSite) => {
            res.status(200).json({ message: "Booking Site deleted", data: bookingSite });
        })
        .catch((err) => {
            res
            .status(400)
            .json({ message: "Booking Site could not be deleted", data: err });
        });
    },
}