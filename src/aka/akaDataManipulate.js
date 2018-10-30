const fn = require('../config/fieldNames');

module.exports = (telephones, employees) => {
    let results = employees.data;
    results.forEach(result => {

        currUser = telephones.data.filter(telephone => 
            telephone[fn.aka.personalNumber] == result[fn.aka.personalNumber])

        currUser.forEach((user) => {
            if(user[fn.aka.telephoneType] == 1) {
                result[fn.aka.phone] = user[fn.aka.phone]
                result[fn.aka.areaCode] = user[fn.aka.areaCode]
            } else {
                result[fn.aka.mobilePhone] = user[fn.aka.mobilePhone]
                result[fn.raka.areaCodeMobile] = user[fn.aka.areaCodeMobile]
            }
        })
    });
    
    return results;
}