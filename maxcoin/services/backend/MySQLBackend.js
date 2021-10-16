/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const mysql = require("mysql2/promise");
const CoinAPI = require("../CoinAPI");

class MySQLBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.connection = null;
  }

  async connect() {
    this.connection = await mysql.createConnection({
      host: "localhost",
      port: 3406,
      user: "root",
      password: "mypassword",
      database: "maxcoin",
    });
    return this.connection;
  }

  async disconnect() {
    return this.connection.end();
  }

  async insert() {
    const data = await this.coinAPI.fetch();
    const sql = "INSERT INTO coinvalues (valuedate,coinvalue) VALUES ?";
    const values = [];
    Object.entries(data.bpi).forEach((entry) => {
      values.push([entry[0], entry[1]]);
    });
    return this.connection.query(sql, [values]);
  }

  async getMax() {
    return this.connection.query(
      "SELECT * FROM coinvalues ORDER by coinvalue DESC LIMIT 0,1"
    );
  }

  async max() {
    console.info("Connection to Mysql");
    console.time("Mysql-connect");
    const connection = await this.connect();
    if (connection) {
      console.info("Successfully connected to Mysql");
    } else {
      throw new Error("Connecting to Mysql failed");
    }
    console.timeEnd("Mysql-connect");

    console.info("Inserting into Mysql");
    console.time("Mysql-insert");
    const insertResult = await this.insert();
    console.timeEnd("Mysql-insert");

    console.info(
      `Inserted ${insertResult[0].affectedRows} documents into Mysql`
    );
    console.info("Querying Mysql");
    console.time("Mysql-query");
    const result = await this.getMax();
    const row = result[0][0];
    console.timeEnd("Mysql-query");

    console.info("Disconnecting from Mysql");
    console.time("Mysql-disconnect");
    await this.disconnect();
    console.timeEnd("Mysql-disconnect");

    return row;
  }
}

module.exports = MySQLBackend;
