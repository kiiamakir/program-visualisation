const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    onlineElements: [String]
});

courseSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Course', courseSchema);