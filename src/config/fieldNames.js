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
    mm: "mm_name",
    excel: "excel"
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
      uniqeFieldForDeepDiff: "mi"
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
      domainSuffix: "@jello.com",
      userName: "userName",
      uniqeFieldForDeepDiff: "tz"
  },
  excel: {
      entityType: "entityType",
      firstName: "firstName",
      lastName: "lastName",
      identityCard: "tz",
      personalNumber: "mi",
      rank: "rnk",
      phone: "telephone",
      mobilePhone: "telephone",
      hierarchy: "hr",
      mail: "mail",
      job: "job"
  },
  ads_name: {
      firstName: "KfirstName",
      lastName: "KlastName",
      job: "Kjob",
      mail: "mail",
      upn: "userPrincipalName",
      hierarchy: "hierarchy",
      sAMAccountName: "sAMAccountName",
      domainSuffix: "@rabiran.com",
      uniqeFieldForDeepDiff: "sAMAccountName"
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
      uniqeFieldForDeepDiff: "userPrincipalName"
  },
  nvSQL_name: {
      firstName: "KfirstName",
      lastName: "KlastName",
      uniqueID: "unid",
      hierarchy: "hierarchy",
      pn: "pn",
      identityCard: "id",
      uniqeFieldForDeepDiff: "unid"
  },
  entityTypeValue: {
      s: "agumon",
      sPrefix: "m",
      c: "digimon",
      cPrefix: "d"
  },
  rootHierarchy: "wallmart",
  runningTime: {
      hour: 12,
      minute: 54
  },
  recoveryRunningTime: {
      date: 10,
      hour: 0,
      minute: 54
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
      "currentUnit"
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
  kartoffelUrl: "http://localhost:3000"
};
