const mongoose = require('mongoose')

// Definimos os campos que nossos registros terão.
const routerSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    timeend: { 
        type: String,
        required: true,
    },
    begin: { 
        type: String,
        required: true,
    },
    end: { 
        type: String,
        required: true,
    },
      number: { 
        type: String,
        required: true,
        minLength: [11, 'Esse número é invalido'],
        maxLength: [11, 'Número muito grande!! ele existe?'],
    },
  
    
})

// Criamos o Model
const Router = mongoose.model("Router", routerSchema)

module.exports = Router