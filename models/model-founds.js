const mongoose = require('mongoose')

// Definimos os campos que nossos registros terão.
const itemSchema = new mongoose.Schema({
    item: {
        type: String,
        lowercase:true,
    },
    description: {
        type: String,
        lowercase:true,
    },
    sala: { 
        type: String,
    },
    moment: { 
        type: String,
    },
    CreateDt: {
        type: Date,
        default: Date.now,
    }
    
})

// Criamos o Model
const Item = mongoose.model("Item", itemSchema)

module.exports = Item