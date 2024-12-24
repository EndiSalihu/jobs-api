const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide company name!'],
    maxlength: 50
  },

  position: {
    type: String,
    required: [true, 'Please provide position!']
  },

  status: {
    type: String,
    enum: ['interview', 'declined', 'pending'],
    default: 'pending'
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user!']
  }

},  {timestamps: true })

const Job = mongoose.model('Job', jobSchema);
module.exports = Job