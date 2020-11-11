const p = require('../../src/config/paths');
const fn = require('../../src/config/fieldNames');
const trycatch = require('../../src/util/generalUtils/trycatch');
const { logLevel } = require('../../src/util/logger');
const logDetails = require('../../src/util/logDetails');
const { create } = require('njwt');
const AuthClass = require('../../src/auth/auth');
/**
 * Check if the record from raw data exists in Kartoffel, as a duplicate, once only with the ID and once with the PN
 * (similar to isExistInKartoffel)
 * Returns:
 * True - if the person does exist in a duplicate (there are two versions in kartoffel one with id and one with PN)
 * False - if there is no duplicate
 * 
 * maybe when one of them doesnt exist we should add it?
 * @param { DataModel } record
 */
module.exports = async (record,sendLog) => {
    const filterdIdentifiers = [
        record[fn[fn.dataSources.aka].personalNumber],
        record[fn[fn.dataSources.aka].identityCard]
    ].filter(id => id);
    const Auth = new AuthClass(sendLog);
    const identityCard = record[fn[fn.dataSources.aka].identityCard];
    const personalNumber = record[fn[fn.dataSources.aka].personalNumber];
 
    path = identifier => p(identifier).KARTOFFEL_PERSON_EXISTENCE_CHECKING;

    tryIdentityCard = await trycatch(
        async identifier => (await Auth.axiosKartoffel.get(path(identifier))).data,
        identityCard   //removed triple dots?
    );
    tryPersonalNumber = await trycatch(
        async identifier => (await Auth.axiosKartoffel.get(path(identifier))).data,
        personalNumber
    );

    //ID doesnt exist
    if (tryIdentityCard.err && tryIdentityCard.err.response && tryIdentityCard.err.response.status === 404) {
        return false;
    }

    //PN doesnt exist
    if (tryPersonalNumber.err && tryPersonalNumber.err.response && tryPersonalNumber.err.response.status === 404) {
        return false;
    }

    // if (resultID.id === resultPN.id) {
    //     return true;
    // }

    // else{
    //     return false;
    // }
    if(tryPersonalNumber.result && tryIdentityCard.result) {
        return tryPersonalNumber.result.id !== tryIdentityCard.result.id;
    }
    

    let errorMessage = createError(tryIdentityCard, tryPersonalNumber);
    sendLog(
        logLevel.error,
        logDetails.error.ERR_GET_ALL_FROM_KARTOFFEL,
        "samePersonMissingInformation",
        errorMessage
    );
    return false;
}

function createError(tryIdentityCard, tryPersonalNumber){
    let errorMessageID = (tryIdentityCard.err.response) ? tryIdentityCard.err.response.data.message : tryIdentityCard.err.message;
    let errorMessagePN = (tryPersonalNumber.err.response) ? tryPersonalNumber.err.response.data.message : tryPersonalNumber.err.message;
    let errorMessage = "";
    if(errorMessageID){
        errorMessage += errorMessageID;
    }
    if(errorMessagePN){
        if(errorMessageID){
            errorMessage += " AND ";
        }
        errorMessage += errorMessagePN;
    }
    return errorMessage;
}