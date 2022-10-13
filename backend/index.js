//! Importing packages
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

//!import routes
const ruotes_conti_categorie = require("./routes/conti_categorie");
const ruotes_movs = require("./routes/movimenti");
const routes_riepilogo = require("./routes/riepilogo");
const { unknownEndpoint } = require("./routes/default");
//const movimenti_model = require("./movimenti_model"); //!

//!configuration
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

//!PostgreSQL connection & TEST
//const res = sequelize.query("SELECT NOW()", { type: QueryTypes.SELECT });

//!Route Middlewares
//app.use("/conticategorie", ruotes_conti_categorie);
app.use("/movimenti", ruotes_movs);
app.use("/conticategorie", ruotes_conti_categorie);
app.use("/riepilogo", routes_riepilogo);
app.use(unknownEndpoint);

//!Server listening
app.listen(process.env.PORT, () => start());

const start = () => {
  console.log(`App running on port ${process.env.PORT}.`);
};
