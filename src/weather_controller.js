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

      res.send(weather)
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

      res.send(weathers)
    } catch (err) {
      console.error(err)
      res.status(404).send({ message: 'error' })
    }
  },
}
