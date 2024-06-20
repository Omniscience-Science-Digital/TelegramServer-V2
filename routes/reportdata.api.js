const express = require('express')
const router = express.Router()
const reportController = require('../controllers/report.controller')
const mqttController = require('../controllers/mqtt.controller')

//routers



router.post('/webhooktrigger', reportController.runReportdata)
router.post('/mqttTrigger', mqttController.Mqttcontroller)


module.exports=router