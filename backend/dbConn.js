const { Pool } = require("pg");
const Query = require("./models/Query");

//!PostgreSQL connection
const pool = new Pool();

module.exports = {
  async queryTransaction(textParamsArray) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (let i = 0; i < textParamsArray.length; i++) {
        const q = new Query(textParamsArray[i].text, textParamsArray[i].params);
        const queryText = q.text;
        const queryParams = q.params;
        const start = Date.now();
        const res = await client.query(queryText, queryParams);
        const duration = Date.now() - start;
        console.log("executed query<", queryText, ">", {
          queryText,
          duration,
          rows: res.rowCount,
        });
      }
      await client.query("COMMIT");
    } catch (e) {
      console.log("error in query Transaction!!! ->", textParamsArray, e);
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  },
  async query(text, params) {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      // time elapsed since invocation to execution
      const duration = Date.now() - start;
      console.log("executed query<", text, ">", {
        text,
        duration,
        rows: res.rowCount,
      });
      return res;
    } catch (error) {
      console.log("error in query!!!<", text, ">");
      throw error;
    }
  },
};

// text will be something like 'SELECT * FROM $1'
// params something like this array: ['users'] i.e. the table name
// $1 => replaced by users in final query
