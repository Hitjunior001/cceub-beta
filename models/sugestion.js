const mongoose = require('mongoose')

// Definimos os campos que nossos registros terão.
const sugestionSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    sugestion: { 
        type: String,
        required: true,
    },
    CreateDt: {
        type: Date,
        default: Date.now,
    },
})

// Criamos o Model
const Sugestion = mongoose.model("Sugestion", sugestionSchema)

module.exports = Sugestion