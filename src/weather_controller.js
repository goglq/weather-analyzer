const db = require('./db')

module.exports = {
  getCity: async (req, res) => {
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

      res.send({
        id: weather.id,
        temp: weather.temp,
        temp_feels_like: weather.temp_feels_like,
        temp_min: weather.temp_min,
        temp_max: weather.temp_max,
        pressure: weather.pressure,
        humidity: weather.humidity,
        wind_speed: weather.wind_speed,
        wind_deg: weather.wind_deg,
        wind_gust: weather.wind_gust,
        createdAt: weather.createdAt,
        updatedAt: weather.updatedAt,
        city: city.name,
      })
    } catch (err) {
      console.error(err)
      res.status(404).send({ message: 'error' })
    }
  },
  getHistory: async (req, res) => {
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

      res.send(
        weathers.map((weather) => {
          return {
            id: weather.id,
            temp: weather.temp,
            temp_feels_like: weather.temp_feels_like,
            temp_min: weather.temp_min,
            temp_max: weather.temp_max,
            pressure: weather.pressure,
            humidity: weather.humidity,
            wind_speed: weather.wind_speed,
            wind_deg: weather.wind_deg,
            wind_gust: weather.wind_gust,
            createdAt: weather.createdAt,
            updatedAt: weather.updatedAt,
            city: city.name,
          }
        })
      )
    } catch (err) {
      console.error(err)
      res.status(404).send({ message: 'error' })
    }
  },
}
