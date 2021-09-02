const fetch = require('cross-fetch')
const moment = require('moment')
const { Op } = require('sequelize')

const API_KEY = process.env.WEATHER_API_KEY

async function getTemperature(db) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Moscow&units=metric&appid=${API_KEY}`
  )
  const json = await response.json()
  const city = await db.City.findOne({ where: { name: 'moscow' } })
  await db.Weather.create({
    temp: json.main.temp,
    temp_feels_like: json.main.feels_like,
    temp_min: json.main.temp_min,
    temp_max: json.main.temp_max,
    pressure: json.main.pressure,
    humidity: json.main.humidity,
    wind_speed: json.wind.speed,
    wind_deg: json.wind.deg,
    wind_gust: json.wind.gust,
    cityId: city.id,
  })
}

function cleanWeather(db) {
  db.Weather.destroy({
    where: {
      createdAt: {
        [Op.lte]: moment().subtract(7, 'days').toDate(),
      },
    },
  })
}

module.exports = {
  getTemperature,
  cleanWeather,
}
