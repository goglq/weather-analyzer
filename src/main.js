if (process.env.APP_MODE === 'development') {
  require('dotenv').config()
}

const express = require('express')
const db = require('./db')
const jobs = require('./jobs')
const controller = require('./weather_controller')

const PORT = process.env.PORT

const app = express()

app.use(express.json())

app.get('/weather/history/:city', (req, res) => controller.getHistory(req, res))

app.get('/weather/:city', (req, res) => controller.getCity(req, res))

jobs.addTemperatureJob.start()
jobs.cleanWeatherJob.start()

db.sequelize.sync().then(async () => {
  const cities = await db.City.findAll()

  if (cities.length === 0) {
    db.City.create({
      name: 'moscow',
    })
  }

  app.listen(PORT, () => console.log(`app is listening on port ${PORT}`))
})
