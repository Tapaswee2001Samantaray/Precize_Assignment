const express = require("express");
const router = express.Router();

const { InsertResult, getAllData, getRank, updateScore, deleteRecord } = require("../controllers/ResultController");


router.post("/record", InsertResult);

router.get("/record", getAllData);
router.get("/rank/:name", getRank);

router.put("/score/:name", updateScore);

router.delete("/record/:name", deleteRecord);



module.exports = router;