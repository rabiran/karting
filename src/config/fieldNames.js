module.exports = {
    aka: {
        entityType: "nstype",
        firstName: "firstName",
        lastName: "lastName",
        identityCard: "tz",
        personalNumber: "mi",
        rank: "rnk",
        phone: "telephone",
        areaCode: "ktelephone",
        mobilePhone: "telephone",
        areaCodeMobile: "ktelephone",
        dischargeDay: "rld",
        clearance: "clearance",
        unitName: "hr",
        telephoneType: "telephoneType"
    },
    es: {
        entityType: "stype",
        firstName: "firstName",
        lastName: "lastName",
        identityCard: "tz",
        personalNumber: "mi",
        rank: "rnk",
        phone: "vphone",
        mobilePhone: "cphone",
        dischargeDay: "rld",
        hierarchy: "hr",
        mail: "mail",
        address: "adr",
        job: "tf",
        domainSuffix:"@es",
        userName:"userName",
    },
    ads:{
        firstName: "KfirstName",
        lastName: "KlastName",
        job:"Kjob",
        mail: "mail",
        upn:"userPrincipalName",
        hierarchy:"hierarchy",
        sAMAccountName:"sAMAccountName",  
        domainSuffix:"@ads",
    },
    entityTypeValue: {
        s: "digimon",
        sPrefix:"m",
        c: "tamar",
        cPrefix:"d",
    },
    rootHierarchy: "wallmart",
    ad: {
        ldapURL: "LDAP://{LDAP_URL}",
        LDAP_USER: "Daniel",
        LDAP_PASSWORD: "Ezra",
        baseDN: "OU='bla'",
    },
    runningTime: {
        hour: 12,
        minute: 54
    },
    validators:{
        phone:/^\d{1,2}-?\d{6,7}$|^\*\d{3}$|^\d{4,5}$/,
        mobilePhone:/^\d{2,3}-?\d{7}$/,
    },
    kartoffelUrl: "http://localhost:3000",
};
