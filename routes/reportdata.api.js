const express = require('express')
const router = express.Router()
const reportController = require('../controllers/report.controller')
const mqttController = require('../controllers/mqtt.controller')

//routers



router.post('/webhooktrigger', reportController.runReportdata)
router.post('/mqttTrigger', mqttController.Mqttcontroller)

router.get('/', (req, res) => {
    res.send('Omniscience Digital');
});


module.exports=router