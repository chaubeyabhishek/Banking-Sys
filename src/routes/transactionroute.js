const {Router} = require('express');
const transaction = Router();
const authMiddleware = require("../middleware/authmiddleware");


transaction.post("/",authMiddleware)

