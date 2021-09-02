if (process.env.APP_MODE === 'development') {
  require('dotenv').config()
}

const express = require('express')
const db = require('./db')
const cron = require('cron').CronJob
const services = require('./services')

const PORT = process.env.PORT

const app = express()
app.use(express.json())

app.get('/weather/history/:city', async (req, res) => {
  try {
    const city = await db.City.findOne({
      where: {
        name: req.params['city'].toLowerCase(),
      },
    })

    if (city === null) {
      throw new Error('wrong city')
    }

    const weathers = await db.Weather.findAll({
      where: {
        cityId: city.id,
      },
      order: [['id', 'DESC']],
    })

    if (weathers.length === 0) {
      throw new Error('weathers is empty')
    }

    res.send(weathers)
  } catch (err) {
    console.error(err)
    res.status(404).send({ message: 'error' })
  }
})

app.get('/weather/:city', async (req, res) => {
  try {
    const city = await db.City.findOne({
      where: {
        name: req.params['city'].toLowerCase(),
      },
    })

    if (city === null) {
      throw new Error('wrong city')
    }

    const weather = await db.Weather.findOne({
      where: {
        cityId: city.id,
      },
      order: [['id', 'DESC']],
    })

    if (weather === null) {
      throw new Error('weather is undefined')
    }

    res.send(weather)
  } catch (err) {
    console.error(err)
    res.status(404).send({ message: 'error' })
  }
})

const ADD_TEMP_CRON = process.env.ADD_TEMP_CRON

const addTemperatureJob = new cron(
  ADD_TEMP_CRON,
  () => {
    services.getTemperature(db)
  },
  null,
  true,
  'Europe/London'
)
addTemperatureJob.start()

const CLEAN_WEATHER_CRON = process.env.CLEAN_WEATHER_CRON

const cleanWeatherJob = new cron(
  CLEAN_WEATHER_CRON,
  () => {
    services.cleanWeather(db)
  },
  null,
  true,
  'Europe/London'
)
cleanWeatherJob.start()

db.sequelize.sync().then(async () => {
  const cities = await db.City.findAll()

  if (cities.length === 0) {
    db.City.create({
      name: 'moscow',
    })
  }

  app.listen(PORT, () => console.log(`app is listening on port ${PORT}`))
})
