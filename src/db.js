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
  console.log('development')
} else {
  sequelize = new Sequelize(CONNECTION_STR, opt)
}

console.log(CONNECTION_STR)

const City = sequelize.define(
  'cities',
  {
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    alter: true,
  }
)

const Weather = sequelize.define(
  'weathers',
  {
    temp: {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    },
    temp_feels_like: {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    },
    temp_min: {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    },
    temp_max: {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    },
    pressure: {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    },
    humidity: {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    },
    wind_speed: {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    },
    wind_deg: {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    },
    wind_gust: {
      type: Sequelize.DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    alter: true,
  }
)

City.hasMany(Weather)
Weather.belongsTo(City)

module.exports = {
  sequelize,
  Weather,
  City,
}
