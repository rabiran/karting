const fn = require('../config/fieldNames');

module.exports = (phones, telephones, employees) => {
    let results = employees.data;
    results.forEach(result => {
        telephones.data.forEach(telephone => {
            if (telephone[fn.aka.personalNumber] == result[fn.aka.personalNumber]) {
                result[fn.aka.phone] = telephone[fn.aka.phone]
                result[fn.aka.areaCode] = telephone[fn.aka.areaCode]
                return;
            }
        })

        phones.data.forEach(phone => {
            if (phone[fn.aka.personalNumber] == result[fn.aka.personalNumber]) {
                result[fn.aka.mobilePhone] = phone[fn.aka.mobilePhone]
                result[fn.aka.areaCodeMobile] = phone[fn.aka.areaCodeMobile]
                return;
            }
        })
    });
    
    return results;
}