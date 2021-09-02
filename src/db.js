const Sequelize = require('sequelize')

const CONNECTION_STR = process.env.DATABASE_URL

const opt = {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
}

let sequelize

if (process.env.APP_MODE === 'development') {
  sequelize = new Sequelize(CONNECTION_STR)
} else {
  sequelize = new Sequelize(CONNECTION_STR, opt)
}

const City = sequelize.define('cities', {
  name: Sequelize.STRING,
})

const Weather = sequelize.define('weathers', {
  temp: Sequelize.FLOAT,
  temp_feels_like: Sequelize.FLOAT,
  temp_min: Sequelize.FLOAT,
  temp_max: Sequelize.FLOAT,
  pressure: Sequelize.FLOAT,
  humidity: Sequelize.FLOAT,
  wind_speed: Sequelize.FLOAT,
  wind_deg: Sequelize.FLOAT,
  wind_gust: Sequelize.FLOAT,
})

City.hasMany(Weather)
Weather.belongsTo(City)

module.exports = {
  sequelize,
  Weather,
  City,
}
