const Sequelize = require("sequelize");

const config = require("../config");
const userDefinition = require("./user");
const fileDefinition = require("./file");

const sequelize = new Sequelize(
  config.DB_DATABASE,
  config.DB_USERNAME,
  config.DB_PASSWORD,
  {
    dialect: "mysql",
    host: config.DB_HOST
  }
);

async function initializeDB() {
  try {
    await sequelize.sync();
    console.log("DB ready");
  } catch (err) {
    console.log(err);
  }
}

const User = sequelize.define("User", ...Object.values(userDefinition));
const File = sequelize.define("File", ...Object.values(fileDefinition));

module.exports = { initializeDB, User, File };
