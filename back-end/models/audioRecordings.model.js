const mongoose = require('mongoose')

const { Schema } = mongoose

const audioSchema  = new Schema({
  name: String,
  url: String,
  data: Buffer,
}, {timestamps: true})

const AudioRecordings = mongoose.model('AudioRecordings', audioSchema)

module.exports = AudioRecordings
