//const MongoBackend = require("./services/backend/MongoBackend");
const MYSQLBackend = require("./services/backend/MySQLBackend");

// async function run() {
//   const mongoBackend = new MongoBackend();
//   return mongoBackend.max();
// }

async function runMySQL() {
  const mySQLBackend = new MYSQLBackend();
  return mySQLBackend.max();
}

runMySQL()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => console.error(err));
