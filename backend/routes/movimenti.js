const router = require("express").Router();
const movimenti_controller = require("../controllers/movimenti_controller");

router.get("/", (req, res, next) => {
  movimenti_controller
    .getMovimenti(req, res)
    .then((response) => {
      //console.log("RESPONSE:", response);
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log("ERROR:", error);
      res.status(500).json(error);
    });
});

router.get("/ccdata", (req, res, next) => {
  movimenti_controller
    .getDatiCCNewMov(req, res)
    .then((response) => {
      //console.log("RESPONSE:", response);
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log("ERROR:", error);
      res.status(500).json(error);
    });
});

router.post("/", (req, res, next) => {
  //console.log(req);
  movimenti_controller
    .creaMovimento(req, res)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/:id", (req, res, next) => {
  console.log("UPDATE");
  movimenti_controller
    .updateMovimento(req, res)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.delete("/:id", (req, res, next) => {
  console.log("DELETE");
  movimenti_controller
    .deleteMovimento(req.params.id, res)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;
