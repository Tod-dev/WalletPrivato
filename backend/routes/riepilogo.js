const router = require("express").Router();
const riepilogo_controller = require("../controllers/riepilogo_controller");

router.get("/", (req, res, next) => {
  riepilogo_controller
    .getDatiGrafico(req, res)
    .then((response) => {
      //console.log("RESPONSE:", response);
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log("ERROR:", error);
      res.status(500).json(error);
    });
});

module.exports = router;
