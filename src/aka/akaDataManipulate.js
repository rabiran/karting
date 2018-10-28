export default(phones, telephones, employees) => {
    let results = employees;
    results.forEach(result => {
        telephones.forEach(telephone => {
            if (telephone[personalNumber] == result[personalNumber]) {
                result[phone] = telephone[phone]
                result[areaCode] = telephone[areaCode]
                return;
            }
        })

        phones.forEach(phone => {
            if (phone[personalNumber] == result[personalNumber]) {
                result[mobilePhone] = phone[mobilePhone]
                result[areaCodeMobile] = phone[areaCodeMobile]
                return;
            }
        })
    });
    
    return results;
}