const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

//Controllers
const audioRecordsRouter = require('./controllers/audioRecords')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 8000

// Server middleware
app.use(cors())
app.use(express.json())

// MongoDB conecction config
const uri = process.env.ATLAS_URI
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})

const { connection } = mongoose

//init connection
connection.once('open', () => {
  console.log('MongoDB connection successfully')
})

// API Urls
app.use('/audio', audioRecordsRouter)

app.listen(port, () => {
  console.log(`Server is runing on port: ${port}`)
})
