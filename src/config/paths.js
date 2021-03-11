const fn = require('./fieldNames');

const kartoffelUrl = fn.kartoffelUrl;

module.exports = pathsHandler = (param, param2) => {
    return {
        // Data source
        AKA_TELEPHONES_API: "http://localhost:3001/getAkaTelephone",
        AKA_EMPLOYEES_API: "http://localhost:3001/getAkaEmployees",
        AKA_PICTURES_API: "http://localhost:3001/getAkaImgMetaData",
        [`${fn.dataSources.es}_API`]: 'http://localhost:3001/getEightSocks',
        [`${fn.dataSources.ads}_API`]: 'http://localhost:3001/getAD/s',
        [`${fn.dataSources.adNN}_API`]: 'http://localhost:3001/getAD/NN',
        [`${fn.dataSources.mm}_API`]: 'http://localhost:3001/getMM',
        [`${fn.dataSources.novaMM}_API`]: 'http://localhost:3001/getNv/sql/mm',
        [`${fn.dataSources.lmn}_API`]: 'http://localhost:3001/getNv/sql/lmn',
        [`${fn.dataSources.mdn}_API`]: 'http://localhost:3001/getNv/sql/mdn',
        [`${fn.dataSources.city}_API`]: 'http://localhost:3001/getCity',
        immediateServer_API: '/immediateRun',


        // Kartoffel - person
        KARTOFFEL_UPDATE_PERSON_API: `${kartoffelUrl}/api/persons/${param}`,
        KARTOFFEL_PERSON_API: `${kartoffelUrl}/api/persons/`,
        KARTOFFEL_PERSON_EXISTENCE_CHECKING: `${kartoffelUrl}/api/persons/identifier/${param}`,
        KARTOFFEL_PERSON_ASSIGN_API : `${kartoffelUrl}/api/persons/${param}/assign`,
        KARTOFFEL_PERSON_BY_DOMAIN_USER: `${kartoffelUrl}/api/persons/domainUser/${param}`,

        // Kartoffel - group
        KARTOFFEL_ADDGROUP_API: `${kartoffelUrl}/api/organizationGroups/`,
        KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_API: `${kartoffelUrl}/api/organizationGroups/path/${param}/hierarchyExistenceChecking`,
        KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_BY_DISPLAYNAME_API: `${kartoffelUrl}/api/organizationGroups/path/${param}`,
        KARTOFFEL_GROUP_BY_AKA_UNIT: `${kartoffelUrl}/api/organizationGroups/akaUnit/${param}`,

        // Kartoffel - domainUser
        KARTOFFEL_ADD_DOMAIN_USER_API: `${kartoffelUrl}/api/persons/${param}/domainUsers`,
        KARTOFFEL_DELETE_DOMAIN_USER_API: `${kartoffelUrl}/api/persons/${param}/domainUsers/${param2}`,
        KARTOFFEL_DOMAIN_USER_API: `${kartoffelUrl}/api/persons/domainUser/${param}`,
    }
}
