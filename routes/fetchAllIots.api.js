const express = require("express")
const router = express.Router()
const iotController = require('../controllers/fetchAllIot.controller')


//Get All Iots
router.get('/fetchAllIots', iotController.listIotTables)
router.get('/getBillableMessages', iotController.getBillableData)



module.exports = router