const express = require("express")
const router = express.Router()
const statusreportController = require('../controllers/internalStatusreport.controller')


//Get All Iots
router.get('/statusreport', statusreportController.Statusreportcontroller)




module.exports = router