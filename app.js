const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const { PORT = 3000 } = process.env
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost:27017/mestodb')

app.use((req, res, next) => {
  req.user = {
    _id: '62a98d99a69d976f26139c0e'
  };
  next();
})
app.use('/users', require('./routes/users'))
app.use('/cards', require('./routes/cards'))

/* app.use(express.static(path.join(__dirname, 'build'))) */
app.use('*', (_req, res) => {
  res.status(404).send({ message: "Not found" })
})
app.listen(PORT)
