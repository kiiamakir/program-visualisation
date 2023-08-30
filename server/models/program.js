const mongoose = require('mongoose')

const programSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: false },
    courses: [{
        type: String,
        ref: 'Course',
        required: false
    }],
    children: [{
        type: String,
         ref: 'Program',
         required: false
    }]
})

programSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Program', programSchema)