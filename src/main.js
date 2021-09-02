const express = require('express')
const db = require('./db')
const cron = require('cron').CronJob
const services = require('./services')

const PORT = process.env.PORT

const app = express()
app.use(express.json())

app.get('/history/:city', async (req, res) => {
  try {
    const city = await db.City.findOne({
      where: {
        name: req.params['city'],
      },
    })

    if (city === undefined) {
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
    res.status(404).send({ message: 'error' })
  }
})

app.get('/:city', async (req, res) => {
  try {
    const city = await db.City.findOne({
      where: {
        name: req.params['city'].toLowerCase(),
      },
    })

    if (city === undefined) {
      throw new Error('wrong city')
    }

    const weather = await db.Weather.findOne({
      where: {
        cityId: city.id,
      },
      order: [['id', 'DESC']],
    })

    if (weather === undefined) {
      throw new Error('weather is undefined')
    }

    res.send(weather)
  } catch (err) {
    res.status(404).send({ message: 'error' })
  }
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
