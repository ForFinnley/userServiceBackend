const cryptoUtil = require('../utils/crypto.js');
const httpUtil = require('../utils/httpUtil.js');
const database = require('../utils/mongoUser.js');

function validate(params, res) {
    
    if (!params.emailHash) {
        res.send(httpUtil.createResponse(400, "ERROR : Missing emailHash."));
        return false;
    }

    return true;
}

/**
 * Changes emailVerified field to true
 * @param {*} req 
 * @param {*} res 
 */
module.exports.handler = async function (req, res) {
    console.log("Starting function verifyEmail...");
    console.log(req.params);

    if (req.params === null || !validate(req.params, res)) {
        return;
    }

    let emailHash = req.params.emailHash;

    let email = cryptoUtil.hashDecrypt(emailHash);
    let result = await database.updateUser(email, { emailVerified: true });
    console.log(result);
    res.send(httpUtil.createResponse(200, "SUCCESS : Email verified."));
}