const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => { console.log(err) });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

const initDB = async () => {
    await Listing.deleteMany({});
    const modifiedData = initData.data.map((obj) => ({
        ...obj,
        owner: "67a39cf5840494284658f3be" // Adding owner field
    }));

    console.log("Inserting Data:", modifiedData);  // Debugging

    await Listing.insertMany(modifiedData);
    console.log("Data was initialized");
};

initDB();
