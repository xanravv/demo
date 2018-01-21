require('../models/User');
require('../models/Subsidy');
require('../models/Transactions');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Subsidy = mongoose.model('subsidytrxs');
const Transaction = mongoose.model('trxs');

class TransactionClass {

    /*
    * Spends the tokens for a service
    *
    * @param {object} transactionObject contains all the transaction details:
        *  idUser
        *  idCompany
        *  amount
        *  subject
     */

    static spendTokens (transactionObject)
    {

        const newTransaction = new Transaction({
            from:transactionObject.idUser,
            to: transactionObject.idCompany,
            amount:transactionObject.amount,
            subject:transactionObject.subject
        });

        newTransaction.save();

        User.findOne({
            email:"gemeenteEindhoven@mail.com"
        }).then(user =>{
            this.subsidyPaymentBroadcast(user.id, transactionObject.idCompany, transactionObject.amount, newTransaction.id);
            this.increaseSubsidyAccountReceiver(transactionObject.idCompany, transactionObject.amount);
            this.decreaseSubsidyAccountMunicipality(user.id, transactionObject.amount);
        })
    };

    // Pay subsidy from municipality to the company
    static subsidyPaymentBroadcast(from, to, amount, transactionId)
    {
        const newSubsidy = new Subsidy({
            from:from,
            to: to,
            amount:amount,
            transactionId:transactionId
        });
        newSubsidy.save();
    }

    /* TODO:
    * subtract the money from the "gemeenteEindhoven@mail.com" bankAccount.
     */
    static increaseSubsidyAccountReceiver (accountId, amount) {
        User.findOne({
            _id: accountId
        }).then(user => {
            user.subsidyAccount = Number(user.subsidyAccount) + Number(amount);
            user.save();
        });
    }

    static decreaseSubsidyAccountMunicipality (municipalityId, amount) {
        User.findOne({
            _id:municipalityId
        }).then(user =>{
            user.subsidyAccount = Number(user.subsidyAccount) - Number(amount);
            user.save();
        })
    }
}

module.exports = TransactionClass;