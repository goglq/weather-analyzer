const express = require('express')
const db = require('./db')
const cron = require('cron').CronJob
const services = require('./services')

const PORT = process.env.PORT

const app = express()
app.use(express.json())

app.get('/history/:city', async (req, res) => {
  const city = await db.City.findOne({
    where: {
      name: req.params['city'],
    },
  })

  const weathers = await db.Weather.findAll({
    where: {
      cityId: city.id,
    },
    order: [['id', 'DESC']],
  })

  res.send(weathers)
})

app.get('/:city', async (req, res) => {
  const city = await db.City.findOne({
    where: {
      name: req.params['city'],
    },
  })

  const weather = await db.Weather.findOne({
    where: {
      cityId: city.id,
    },
    order: [['id', 'DESC']],
  })

  res.send(weather)
})

const addTemperatureJob = new cron(
  '0 */4 * * *',
  () => {
    services.getTemperature(db)
  },
  null,
  true,
  'Europe/London'
)
addTemperatureJob.start()

const cleanWeatherJob = new cron(
  '0 0 */7 * *',
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

  if (cities.length == 0) {
    db.City.create({
      name: 'moscow',
    })
  }

  app.listen(PORT, () => console.log(`app is listening on port ${PORT}`))
})
