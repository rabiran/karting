module.exports = {
    dataSources: {
        // aka: "aka_name",
        aka: "aka",
        es: "es_name",
        ads: "ads_name",
        adNN: "adNN_name",
        nvSQL: "nvSQL_name",
        lmn: "lmn_name",
        mdn: "mdn_name",
        novaMM: "novaMM_name",
        mm: "mm_name",
        city: "city_name",
    },
    // aka_name: {
    aka: {
        serviceType: "nstype",
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
        telephoneType: "telephoneType",
        uniqeFieldForDeepDiff: "mi",
        birthDate: "birthday",
        sex: "sex",
        picture: "picture",
    },
    es_name: {
        entityType: "entity",
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
        location: "location",
        domainSuffix: "@jello.com",
        userName: "userName",
        uniqeFieldForDeepDiff: "tz"
    },
    ads_name: {
        firstName: "KfirstName",
        lastName: "KlastName",
        guName:"guName",
        job: "Kjob",
        mail: "mail",
        upn: "userPrincipalName",
        hierarchy: "hierarchy",
        sAMAccountName: "sAMAccountName",
        domainSuffix: "@rabiran.com",
        domainPrefixField:"sAMAccountName",
        uniqeFieldForDeepDiff: "sAMAccountName",
        sPrefix: "m",
        cPrefix: "d",
        guPrefix: "f",
    },
    adNN_name: {
        firstName: "KfirstName",
        lastName: "KlastName",
        fullName: "Kjob",
        mail: "mail",
        upn: "userPrincipalName",
        hierarchy: "hierarchy",
        sAMAccountName: "sAMAccountName",
        extension: "nn",
        domainSuffix: "@adnn",
        uniqeFieldForDeepDiff: "userPrincipalName",
    },
    nvSQL_name: {
        firstName: "KfirstName",
        lastName: "KlastName",
        uniqueID: "unid",
        hierarchy: "hierarchy",
        pn: "pn",
        identityCard: "id",
        uniqeFieldForDeepDiff: "unid",
    },
    city_name: {
        firstName: 'firstName',
        lastName: 'lastName',
        identityCard: 'tz',
        rank: 'rank',
        dischargeDay: 'rld',
        clearance: 'clearance',
        currentUnit: 'department',
        serviceType: 'stype',
        mobilePhone: 'telephone',
        personalNumber: 'personalNumber',
        mail: 'mail',
        job: 'job',
        profession: 'profession',
        hierarchy: 'hr',
        domainUsers: 'domUser',
        company: 'company',
        entityTypePrefix: {
            s: ['e', 'l', 'i'],
            c: ['g', 'j'],
            gu: ['m'],
        },
        uniqeFieldForDeepDiff: 'domUser',
        tags: 'tags',
        userTags: {
            transportable: 'transportable',
            information: 'information',
        },
        domains: 'domains',
        domainNames: {
            internal: 'local',
            external: 'external'
        },
    },
    mm_name: {
        userName : "userName",
        firstName: "firstName",
        lastName: "lastName",
        fullName: "fullName",
        mail: "mail",
        personalNumber: 'personalNumber',
        identityCard: 'tz',
        hierarchy: "hierarchy",
        domainSuffix: "@leonardo.com",
        uniqeFieldForDeepDiff: "personalNumber",
        sex: "sex",
        serviceType: "stype",
        rank: "rank",
        status: "status",
        address: "address",
        telephone: "telephone",
        entityType: "entity",
        dischargeDay: "discharge",
        primaryDU: "primaryDU",
        s: "soldier"
    },
    entityTypeValue: {
        s: "agumon",
        c: "digimon",
        gu: "tamar",
    },
    rootHierarchy: {
        ourCompany: "wallmart",
        city: "city_name"
    },
    runningTime: {
        hour: 12,
        minute: 54,
    },
    recoveryRunningTime: {
        date: 10,
        hour: 0,
        minute: 54,
    },
    personStatus: {
        incomplete: 'incomplete',
        inactive: 'inactive',
        active: 'active',
    },
    akaRigid: [
        "clearance",
        "identityCard",
        "personalNumber",
        "firstName",
        "lastName",
        "dischargeDay",
        "rank",
        "address",
        "mobilePhone",
        "phone",
        "serviceType",
        "pictures",
        "sex",
        "birthDate",
    ],
    forbiddenFieldsToUpdate: ["identityCard", "personalNumber", "directGroup"],
    fieldsForRmoveFromKartoffel: [
        "domainUsers",
        "alive",
        "responsibility",
        "_id",
        "createdAt",
        "updatedAt",
        "fullName",
        "id",
        "hierarchy"
    ],
    runnigTypes: {
        dailyRun: 'daily_run',
        recoveryRun: 'recovery_run',
        immediateRun: 'immediate_run',
        kafkaRun: 'kafka',
    },
    organizationGroups: {
        incompletes_name: 'incomplete',
    },
    flowTypes: {
        add: 'add',
        update: 'update',
    },
    kafkaConf: {
        migartion: {
            flowName: 'kafka-migration',
        },
    },
    redisRetryCount: 3,
    immediatePort: 3002,
    chunckSize: 200,
    luigiLogsPath: 'log/immediate_run',
    kartoffelUrl: "http://localhost:3000",
};
