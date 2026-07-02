const express = require("express");
const router = express.Router();

const {authmiddle} = require("../middleware/authmiddleware");
const {createAccount} = require("../controller/account");


router.post("/",authmiddle,createAccount);

module.exports = router;