const express = require("express")
const router = express.Router()

const reportApi = require("./reportdata.api")


router.use("/api/v1", reportApi)


module.exports = router