// change this field in prodaction
const kartoffelUrl = "http://localhost:3000";

module.exports = pathsHandler = (param)=>{
    return {
        // Data source
        AKA_API : 'http://localhost:3001/getAka',
        NV_API : 'http://localhost:3001/getNva',
        ES_API : 'http://localhost:3001/getEightSocks',
        
        // Kartoffel - person
        KARTOFFEL_PERSON_EXISTENCE_CHECKING_BY_PN_API : `${kartoffelUrl}/api/person/personalNumber/`,
        KARTOFFEL_PERSON_EXISTENCE_CHECKING_BY_TZ_API : `${kartoffelUrl}/api/person/identityCard/`,
        KARTOFFEL_PERSON_API : `${kartoffelUrl}/api/person/`,

        // Kartoffel - group
        KARTOFFEL_ADDGROUP_API : `${kartoffelUrl}/api/organizationGroup/`,
        KARTOFFEL_HIERARCHY_EXISTENCE_CHECKING_API : `${kartoffelUrl}/api/organizationGroup/path/${param}/hierarchyExistenceChecking`,

        // Kartoffel - domainUser
        KARTOFFEL_DOMAIN_USER_API : `${kartoffelUrl}/api/person/domainUser`,
    }
}





