const cron = require('cron').CronJob
const services = require('./services')

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

module.exports = {
  addTemperatureJob,
  cleanWeatherJob,
}
