const fn = require('../config/fieldNames');

module.exports = (telephones, employees) => {
    let telephonesDict = employees.data;
    
    for(let i = 0; i< telephones.length; i++) {
        if(telephonesDict[telephones[i][fn.aka.personalNumber]] != null) {
            telephonesDict[telephones[i][fn.aka.personalNumber]] = [telephonesDict[telephones[i][fn.aka.personalNumber]], telephones[i]]
        } else {
            telephonesDict[telephones[i][fn.aka.personalNumber]] = telephones[i]
        }
    }
        
    for(let j =0; j < employees.length; j++) {
        currEmployee = telephonesDict[employees[j][fn.aka.personalNumber]]
        
        if(Array.isArray(currEmployee)) {
            for(currPhone of currEmployee) {
                if(currPhone[fn.aka.telephoneType] == 1) {
                   employees[j][fn.aka.phone] = currPhone[fn.aka.phone]
                   employees[j][fn.aka.areaCode] = currPhone[fn.aka.areaCode]
                } else if(currPhone[fn.aka.telephoneType] == 2) {
                   employees[j][fn.aka.mobilePhone] = currPhone[fn.aka.phone]
                   employees[j][fn.aka.areaCodeMobile] = currPhone[fn.aka.areaCode]
                }
            }
        }
        else {
            if(currPhone[fn.aka.telephoneType] == 1) {
                employees[j][fn.aka.phone] = currPhone[fn.aka.phone]
                employees[j][fn.aka.areaCode] = currPhone[fn.aka.areaCode]
             } else if(currPhone[fn.aka.telephoneType] == 2) {
                employees[j][fn.aka.mobilePhone] = currPhone[fn.aka.phone]
                employees[j][fn.aka.areaCodeMobile] = currPhone[fn.aka.areaCode]
           }
        }
    }
    
    return employees;
}
