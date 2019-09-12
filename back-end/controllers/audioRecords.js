const router = require('express').Router()
const AudioRecordings = require('../models/audioRecordings.model')

router.route('/').get((request, response) => {
  AudioRecordings.find()
    .then(data => response.json(data))
    .catch(err => response.status(400).json(`Error: ${err}`))
})

router.route('/add').post((request, response) => {
  const {
    name,
    data
  } = request.body
  const audioRecord = new AudioRecordings({name, data})
  audioRecord.save()
    .then(() => response.json('Audio Added successfully'))
    .catch(err => response.status(400).json(`Error: ${err}`))
})

router.route('/delete').post((request, response) => {
  const id = request.body.id
  AudioRecordings.deleteOne({"_id": id})
    .then(() => response.json('Audio Deleted'))
    .catch(err => response.status(400).json(`Error: ${err}`))
})

router.route('/edit').post((request, response) => {
  const {
    id,
    name
  } = request.body
  AudioRecordings.updateOne({ _id: id }, { name })
    .then(() => response.json('Audio Updated'))
    .catch(err => response.status(400).json(`Error: ${err}`))
})

module.exports = router