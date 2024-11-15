const express = require("express");
const { searchProsumers } = require("../controllers/searchController");
const router = express.Router();

router.get("/search", searchProsumers);
// You can add /select and other endpoints here

module.exports = router;
