const transaction = require("../model/transaction");
const ledgerModel = require("../model/ledger");
const account = require("../model/account");
const emailService = require("../services/emailServices");
const accountModel = require("../model/account");



exports.createTransaction(req,res){
    const {fromAccount , toAccount , amount , idempotencyKey} = req.body;

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"FromAccount , toAccount , amount and idempotencyKey are required"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
    })

    const toUserAccount = await account.findOne({
        _id: toAccount,
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message: "Invalid fromAccount or toAccount"
        })
    }


    const isTransactionAlreadyExists = await transaction.findOne({
        idempotencyKey: idempotencyKey
    })

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status == "COMPLETED"){
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            })
        }

        if(isTransactionAlreadyExists == "PENDING"){
            return res.status(200).json({
               message: "Transaction is still processing",
            })
        }

        if(isTransactionAlreadyExists == "FAILED"){
            return res.status(500).json({
                message: "Transaction processing failed previously, please retry"
            })
        }

        if(isTransactionAlreadyExists = "REVERSED"){
            return res.status(500).json({
                message: "Transaction was reversed, please retry"
            })
        }
    }

    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be ACTIVE to process transaction"
        })
    }

    /**
     *4. Derive sender balance from ledger
     */

     const balance = await fromUserAccount.getBalance()

     if(balance < amount){
        return res.status(400).json({
            message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`

        })
     }

}