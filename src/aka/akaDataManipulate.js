export default(phones, telephones, employees) => {
    let results = employees;
    results.forEach(result => {
        telephones.forEach(telephone => {
            if (telephone[personalNumber] == result[personalNumber]) {
                result.mobile = telephone.mobile
                result.kmobile = telephone.kmobile
                return;
            }
        })
    });

    results.forEach(result => {
        phones.forEach(phone => {
            if (phone[personalNumber] == result[personalNumber]) {
                result.mobile = phone.mobile
                result.kmobile = phone.kmobile
                return;
            }
        })
    });
    
    return results;
}