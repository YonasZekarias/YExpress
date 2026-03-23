const router = require("express").Router();
const { chapaCallback } = require("../controllers/chapa.controller");

router.get("/callback", chapaCallback);
router.post("/callback", chapaCallback);

module.exports = router;
