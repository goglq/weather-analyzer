const cron = require('cron').CronJob
const services = require('./services')
const ADD_TEMP_CRON = process.env.ADD_TEMP_CRON
const CRON_TIMEZONE = process.env.CRON_TIMEZONE

const CLEAN_WEATHER_CRON = process.env.CLEAN_WEATHER_CRON

function startJobs(db) {
  const cleanWeatherJob = new cron(
    CLEAN_WEATHER_CRON,
    () => {
      services.cleanWeather(db)
    },
    null,
    true,
    CRON_TIMEZONE
  )

  cleanWeatherJob.start()

  const addTemperatureJob = new cron(
    ADD_TEMP_CRON,
    () => {
      services.getTemperature(db)
    },
    null,
    true,
    CRON_TIMEZONE
  )

  addTemperatureJob.start()

  return {
    cleanWeatherJob,
    addTemperatureJob,
  }
}

module.exports = {
  startJobs,
}
