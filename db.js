const postgres = require('postgres');
require('dotenv').config();
// eslint-disable-next-line no-undef
const sql = postgres(process.env.DATABASE_URL);

module.exports = sql;