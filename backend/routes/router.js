const express = require("express")
const { handler, getHotels } = require("../controllers/controller") 
const router = express.Router()

router.get("/", handler)
router.get("/get-hotels", getHotels)

module.exports = router