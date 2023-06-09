const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const daySchema = new Schema({
    date : {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    events: []
})


const Day = mongoose.model('Day', daySchema);
module.exports = Day;