const fn = require('../config/fieldNames');

module.exports = (telephones, employees) => {
    let telephonesDict = {};

    for (let i = 0; i < telephones.length - 1; i++) {
        if (telephonesDict[telephones[i][fn.aka.personalNumber]] != null) {
            if (Array.isArray(telephonesDict[telephones[i][fn.aka.personalNumber]])) {
                telephonesDict[telephones[i][fn.aka.personalNumber]] = [...telephonesDict[telephones[i][fn.aka.personalNumber]], telephones[i]]
            } else {
                telephonesDict[telephones[i][fn.aka.personalNumber]] = [telephonesDict[telephones[i][fn.aka.personalNumber]], telephones[i]]
            }
        } else {
            telephonesDict[telephones[i][fn.aka.personalNumber]] = telephones[i]
        }
    }

    for (j = 0; j < employees.length - 1; j++) {
        if(telephonesDict[employees[j][fn.aka.personalNumber]] != undefined) {
            currEmployee = telephonesDict[employees[j][fn.aka.personalNumber]]

            if (Array.isArray(currEmployee)) {
                for (currPhone of currEmployee) {
                    if (currPhone[fn.aka.telephoneType] == 1) {
                        employees[j][fn.aka.phone] = currPhone[fn.aka.mobilePhone]
                        employees[j][fn.aka.areaCode] = currPhone[fn.aka.areaCode]
                    } else if (currPhone[fn.aka.telephoneType] == 2) {
                        employees[j][fn.aka.mobilePhone] = currPhone[fn.aka.mobilePhone]
                        employees[j][fn.aka.areaCodeMobile] = currPhone[fn.aka.areaCode]
                    }
                }
            }
            else {
                if (currEmployee[fn.aka.telephoneType] == 1) {
                    employees[j][fn.aka.phone] = currEmployee[fn.aka.phone]
                    employees[j][fn.aka.areaCode] = currEmployee[fn.aka.areaCode]
                } else if (currEmployee[fn.aka.telephoneType] == 2) {
                    employees[j][fn.aka.mobilePhone] = currEmployee[fn.aka.phone]
                    employees[j][fn.aka.areaCodeMobile] = currEmployee[fn.aka.areaCode]
                }
            }
        }
    }

    return employees;
}
