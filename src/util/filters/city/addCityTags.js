const fn = require('../../../config/fieldNames');
const { logLevel } = require('../../logger');
const logDetails = require('../../logDetails');

/**
 * 
 * @param {*} tags 
 */
const getTagsByTags = (tags) => {
    let isTransportable = false;
    let isInformative = false;
    const record = dataModel.record;
    let tagsLength = tags.length

    for (let i = 0; i < tagsLength; i++) {
        if (tags[i].name === fn[fn.dataSources.city].userTags.transportable) {
            isTransportable = true;
        } else if (tags[i].name === fn[fn.dataSources.city].userTags.information) {
            isInformative = true;
        }
    }
    const addedTags = { 
        isInformative,
        isTransportable
    }
    return addedTags
}

/**
 * 
 * @param {*} domains 
 */
const getTagsByDomain = (domains) => {
    let addedTags = {
        isInternal : false,
        isExternal : false
    }
    if (domains.includes(fn[fn.dataSources.city].domainNames.internal)) {
        addedTags.isInternal = true;
    }
    if (domains.includes(fn[fn.dataSources.city].domainNames.external)) {
        addedTags.isExternal = true;
    }
    return addedTags
}

const addTags = dataModel => {
    const record = dataModel.record;
    const recordDomains = record[fn[fn.dataSources.city].domains]
    const recordTags = record[fn[fn.dataSources.city].tags]
    if (recordDomains)  {
        dataModel.record.addedTags = getTagsByDomain(recordDomains);
    } else {
        dataModel.record.addedTags = getTagsByTags(recordTags);
    }
    return dataModel;
}

module.exports = {
    addTags
}