const mongoose = require('mongoose')

// Definimos os campos que nossos registros terão.
const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    nickname: { 
        type: String,
        required: true,
        unique: true,
    },
    password: { 
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique:true,
        required: true,
        lowercase:true,
    },
    number: { 
        type: String,
        required: true,
        minLength: [11, 'Esse número é invalido'],
        maxLength: [11, 'Número muito grande!! ele existe?'],
    },
    CreateDt: {
        type: Date,
        default: Date.now,
    }
    
})

// Criamos o Model
const User = mongoose.model("User", userSchema)

module.exports = User