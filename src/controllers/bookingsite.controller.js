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
            
            const bookingSite= await BookingSite.findById(bookingSiteId)
            res.status(200).json({ message: "Booking Site found", data: bookingSite });
        }catch (err){
            res.status(404).json(err);
        }
    },

    //Create -POST
    async create(req,res){
        console.log("Cloudinary", req.body)
        const listKeys= Object.values(req.body);
        console.log(listKeys);
        //Espacio para lógica de de llaves file a arreglo
        try{
            const id = req.user;
            const user = await User.findById(id);

            if(!user){
                throw new Error("Invalid user");
            }
        const word ="https"
        const bookingsite = await BookingSite.create({...req.body, user: user})
        for(let i=0; i<listKeys.length;i++){
            if(listKeys[i].includes(word)){
                await bookingsite.images.push(listKeys[i]);
                await bookingsite.save({validateBeforeSave:false});
            }
        }
        await user.bookingsites.push(bookingsite);
        await user.save({validateBeforeSave:false});
        console.log(bookingsite.images)
        res.status(201).json({ message: "Booking Site created", data: bookingsite });
        console.log("aquiesta:", res.secure_url)
    }catch (err) {
        res.status(400).json(err);
    }
    },
    //Update PUT
    async update(req, res){
        
        const listKeys= Object.values(req.body);
        const asArray= Object.entries(req.body);
        console.log("Cloudinary", req.body)
        try{
            
            const id = req.user;
            const { bookingSiteId } = req.params;
            const user = await User.findById(id);

            if(!user){
                throw new Error("Invalid user");
            }
            const bookingSite= await BookingSite.findByIdAndUpdate(bookingSiteId, req.body, { new: true, returnOriginal: false, runValidators: true, useFindAndModify: false,upsert:true,returnDocument:"after", overwrite:true});
            const filtered = asArray.filter(([key, value]) =>  key.includes("file"));
            console.log(filtered)
            for(let j=0; j<filtered.length;j++){
                console.log("AQUI",filtered[j][1])
                    if(filtered[j][1].includes("https")){
                    await bookingSite.images.push(filtered[j][1])
                    await bookingSite.save({validateBeforeSave:false});
                }
            }
            console.log(bookingSite)
            res.status(200).json({ message: "Booking Site updated", data: bookingSite });
        }catch(err){
            res.status(404).json(err);
        }
    },
    //Delete
    async destroy(req, res) {
        try{
        const id = req.user;
        const user = await User.findById(id);
        const { bookingSiteId } = req.params;
        const bookingSite= await BookingSite.findByIdAndDelete(bookingSiteId);
        await user.bookingsites.filter((item)=>{
            item._id.toString() !== bookingSiteId
        })
        res.status(200).json({ message: "Booking Site deleted", data: bookingSite });
    }catch(err){
        res.status(404).json(err);
        };
    },
}