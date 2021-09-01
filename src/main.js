require('dotenv').config()
const express = require('express')
const timeSpan = require('timespan')
const fetch = require('cross-fetch')
const db = require('./db')

const PORT = process.env.PORT
const API_KEY = process.env.WEATHER_API_KEY

const app = express()
app.use(express.json())

app.get('/history/:city', (req, res) => {
  let weathers = db.Weather.findAll()
  res.send(weathers)
})

app.get('/:city', (req, res) => {
  db.Weather.findOne({
    where: {
      city: req.params['city'],
    },
  })
    .then((weather) => {
      res.send(weather)
    })
    .catch((err) => {
      console.log(err)
    })
})

const timeInterval = new timeSpan.TimeSpan(0, 0, 0, 4)

setInterval(() => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Moscow&appid=${API_KEY}`
  )
    .then((res) => {
      if (res.status >= 400) {
        throw new Error('Bad response from server')
      }
      return res.json()
    })
    .then((json) => {
      console.log(json)
    })
    .catch((err) => {
      console.error(err)
    })
}, timeInterval.totalSeconds() * 1000)

db.sequelize.sync().then(() => {
  app.listen(PORT, () => console.log('app is listening on port 3000'))
})
