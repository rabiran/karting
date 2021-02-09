const fn = require('../config/fieldNames');

module.exports = (telephones, employees, pictures) => {
    let telephonesDict = {};
    let picturesDict = {}

    for (let i = 0; i < telephones.length; i++) {
        if (telephonesDict[telephones[i][fn.aka.personalNumber]] != null) { //how can it be an array?
            if (Array.isArray(telephonesDict[telephones[i][fn.aka.personalNumber]])) {
                telephonesDict[telephones[i][fn.aka.personalNumber]] = [...telephonesDict[telephones[i][fn.aka.personalNumber]], telephones[i]]
            } else {
                telephonesDict[telephones[i][fn.aka.personalNumber]] = [telephonesDict[telephones[i][fn.aka.personalNumber]], telephones[i]]
            }
        } else {
            telephonesDict[telephones[i][fn.aka.personalNumber]] = telephones[i]
        }
    }

    //same but for pictures
    for (let i = 0; i < pictures.length; i++) {
            picturesDict[pictures[i].personalNumber] = pictures[i]
    }

    for (j = 0; j < employees.length; j++) {
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
                    employees[j][fn.aka.phone] = currEmployee[fn.aka.mobilePhone]
                    employees[j][fn.aka.areaCode] = currEmployee[fn.aka.areaCode]
                } else if (currEmployee[fn.aka.telephoneType] == 2) {
                    employees[j][fn.aka.mobilePhone] = currEmployee[fn.aka.mobilePhone]
                    employees[j][fn.aka.areaCodeMobile] = currEmployee[fn.aka.areaCode]
                }
            }
        }
        
        //same but for pictures
        if(picturesDict[employees[j][fn.aka.personalNumber]] != undefined) {
            currPicture = picturesDict[employees[j][fn.aka.personalNumber]]
            employees[j][fn.aka.picture] = currPicture
        }
        
    }

    return employees;
}
