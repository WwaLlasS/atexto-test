const router = require('express').Router()
const AudioRecordings = require('../models/audioRecordings.model')
const fs = require('fs')

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
  const url = `/audio/${name}.ogg`
  const audioRecord = new AudioRecordings({name, data, url})
  audioRecord.save()
    .then(file => {
      try {
        fs.writeFileSync(`${__dirname}/../media/audio/${name}.ogg`, Buffer.from(data.replace('data:audio/ogg; codecs=opus;base64,', ''), 'base64'))
      } catch (err){
        console.log(err)
        return response.status(500).end()  
      }
      return response.json('Audio Added successfully')
    })
    .catch(err => response.status(400).json(`Error: ${err}`))
})

router.route('/delete').post((request, response) => {
  const {
    id,
    name
  } = request.body
  let url = '/'
  let pathArray = __dirname.split('/')
  pathArray.pop()
  pathArray.shift()
  pathArray.forEach(item => {
    url += item + '/' 
  })
  try {
    fs.unlinkSync(`${url}media/audio/${name}.ogg`)
    AudioRecordings.deleteOne({"_id": id})
      .then(() => response.json('Audio Deleted'))
      .catch(err => response.status(400).json(`Error: ${err}`))
  } catch (err) {
    return response.json({error: err})
  }
})

router.route('/edit').post((request, response) => {
  const {
    id,
    oldName,
    newName
  } = request.body
  try {
    let url = '/'
    let pathArray = __dirname.split('/')
    pathArray.pop()
    pathArray.shift()
    pathArray.forEach(item => {
      url += item + '/' 
    })
    fs.renameSync(`${url}media/audio/${oldName}.ogg`, `${url}media/audio/${newName}.ogg`)
    AudioRecordings.updateOne({ _id: id }, { name: newName })
      .then(() => response.json('Audio Updated'))
      .catch(err => response.status(400).json(`Error: ${err}`))
  } catch (err) {
    return response.json(err)
  }
})

module.exports = router
