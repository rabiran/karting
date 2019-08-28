const fn = require('./fieldNames');

const kartoffelUrl = fn.kartoffelUrl;

module.exports = pathsHandler = (param) => {
    return {
        // Data source
        AKA_TELEPHONES_API: "http://localhost:3001/getAkaTelephone",
        AKA_EMPLOYEES_API: "http://localhost:3001/getAkaEmployees",
        [`${fn.dataSources.es}_API`]: 'http://localhost:3001/getEightSocks',
        [`${fn.dataSources.ads}_API`]: 'http://localhost:3001/getAD/s',
        [`${fn.dataSources.adNN}_API`]: 'http://localhost:3001/getAD/NN',
        [`${fn.dataSources.mm}_API`]: 'http://localhost:3001/getNv/sql/mm',
        [`${fn.dataSources.lmn}_API`]: 'http://localhost:3001/getNv/sql/lmn',
        [`${fn.dataSources.mdn}_API`]: 'http://localhost:3001/getNv/sql/mdn',

        // Kartoffel - person
        KARTOFFEL_UPDATE_PERSON_API: `${kartoffelUrl}/api/persons/${param}`,
        KARTOFFEL_PERSON_API: `${kartoffelUrl}/api/persons/`,
        KARTOFFEL_PERSON_EXISTENCE_CHECKING: `${kartoffelUrl}/api/persons/identifier/${param}`,
        KARTOFFEL_PERSON_ASSIGN_API : `${kartoffelUrl}/api/persons/${param}/assign`,

        // Kartoffel - group
        KARTOFFEL_ADDGROUP_API: `${kartoffelUrl}/api/organizationGroups/`,
        KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_API: `${kartoffelUrl}/api/organizationGroups/path/${param}/hierarchyExistenceChecking`,
        KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_BY_DISPLAYNAME_API: `${kartoffelUrl}/api/organizationGroups/path/${param}`,

        // Kartoffel - domainUser
        KARTOFFEL_ADD_DOMAIN_USER_API: `${kartoffelUrl}/api/persons/${param}/domainUsers`,
    }
}
