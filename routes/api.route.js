const express = require("express")
const router = express.Router()

const dataApi = require("./fetchAllIots.api")
const reportApi = require("./reportdata.api")


router.use("/api/v1", reportApi)
router.use("/api/v1", dataApi)


module.exports = router