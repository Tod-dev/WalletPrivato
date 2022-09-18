const router = require("express").Router();
const cc_controller = require("../controllers/contiCategorie_controller");

router.get("/conti", (req, res, next) => {
  cc_controller
    .getConti(req, res)
    .then((response) => {
      //console.log("RESPONSE:", response);
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log("ERROR:", error);
      res.status(500).json(error);
    });
});

router.get("/categorie/:tipo", (req, res, next) => {
  cc_controller
    .getCat(req, res, req.params.tipo)
    .then((response) => {
      //console.log("RESPONSE:", response);
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log("ERROR:", error);
      res.status(500).json(error);
    });
});

router.post("/conti", (req, res, next) => {
  cc_controller
    .creaConto(req, res)
    .then((response) => {
      //console.log("RESPONSE:", response);
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log("ERROR:", error);
      res.status(500).json(error);
    });
});

router.post("/conti/:id", (req, res, next) => {
  console.log("UPDATE");
  cc_controller
    .updateConto(req, res)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.delete("/conti/:id", (req, res, next) => {
  console.log("DELETE");
  cc_controller
    .deleteConto(req.params.id)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/categorie", (req, res, next) => {
  cc_controller
    .creaCategoria(req, res)
    .then((response) => {
      //console.log("RESPONSE:", response);
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log("ERROR:", error);
      res.status(500).json(error);
    });
});

router.post("/categorie/:id", (req, res, next) => {
  console.log("UPDATE");
  cc_controller
    .updateCategoria(req, res)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.delete("/categorie/:id", (req, res, next) => {
  console.log("DELETE");
  cc_controller
    .deleteCategoria(req.params.id)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;
