const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const linstingSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: String,
    image: {
        url: {
            type: String,
            required: true,
            default: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWx8ZW58MHx8MHx8fDA%3D",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWx8ZW58MHx8MHx8fDA%3D" : v
        }
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});


const Listing = mongoose.model("Listing", linstingSchema);

module.exports = Listing;