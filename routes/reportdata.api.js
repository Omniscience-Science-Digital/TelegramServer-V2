const express = require('express')
const router = express.Router()
const reportController = require('../controllers/report.controller')

//routers



router.post('/webhooktrigger', reportController.runReportdata)


module.exports=router