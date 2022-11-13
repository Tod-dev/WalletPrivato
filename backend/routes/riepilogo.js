const router = require("express").Router();
const riepilogo_controller = require("../controllers/riepilogo_controller");
const movimenti_controller = require("../controllers/movimenti_controller")

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

router.get("/mese", (req, res, next) => {
  riepilogo_controller
    .getDatiMensile(req, res)
    .then((response) => {
      //console.log("RESPONSE:", response);
      const resSums = response;
       const anno = req.query.anno ? req.query.anno : new Date().getFullYear();
      const mese = req.query.mese ? req.query.mese : (new Date().getMonth() + 1);
      const da = new Date(anno, mese - 1, 1)
      const a = new Date(anno, mese, 0)
      req.query.da = da;
      req.query.a = a;
      movimenti_controller.getMovimenti(req,res).then((response2) => {
        const ret = {
          sums : resSums,
          movements : response2
        }
        res.status(200).json(ret);
      })
    })
    .catch((error) => {
      console.log("ERROR:", error);
      res.status(500).json(error);
    });
});

module.exports = router;
