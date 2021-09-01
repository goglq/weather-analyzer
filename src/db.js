const Sequelize = require('sequelize')

const CONNECTION_STR = process.env.POSTGRES_CONN_STR

const sequelize = new Sequelize(CONNECTION_STR)
const Weather = sequelize.define('weathers', {
  temperature: Sequelize.INTEGER,
  city: Sequelize.STRING,
})

module.exports = {
  sequelize,
  Weather,
}
