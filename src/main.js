if (process.env.APP_MODE === 'development') {
  require('dotenv').config()
}

const express = require('express')
const db = require('./db')
const jobs = require('./jobs')
const controller = require('./weather_controller')
const list_cities = require('./cities.json')

const PORT = process.env.PORT

const app = express()

app.use(express.json())

app.get('/weather/history/:city', (req, res) => controller.getHistory(req, res))

app.get('/weather/:city', (req, res) => controller.getCity(req, res))

jobs.startJobs(db)

db.sequelize.sync().then(async () => {
  const cities = await db.City.findAll()

  if (cities.length === 0) {
    for (const city of list_cities) {
      await db.City.create({
        name: city.toLowerCase(),
      })
    }
  }

  app.listen(PORT, () => console.log(`app is listening on port ${PORT}`))
})
