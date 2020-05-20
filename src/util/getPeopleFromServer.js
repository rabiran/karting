const express = require('express');
const fn = require('../config/fieldNames');
const axios = require("axios");


module.exports = async() => {
    const receivedData = await axios.get('http://localhost:3002/immediateRun');
    // console.log(data);
    if (receivedData.data.objects && receivedData.data.objects.length > 0)
        return receivedData.data;
    else 
        return{
                "dataSource" : "fn.dataSources.es",
                "objects" : [
                    {"tz":"583215090","stype":"A","firstName":"Lamar","lastName":"Wintheiser","mi":"801377888","entity":"agumon","rnk":"unknown",
                    "rld":"2019-04-30 00:00:00.0","vphone":"7501","cphone":"53-8067942","hr":"suscipit/ut/labore","tf":"Designer","userName":"Lamar50","mail":"Lamar50@jello.com"},
                    {"tz":"641434477","stype":"H","mi":"641434477","firstName":"Price","lastName":"Hamill","entity":"digimon","rnk":null,"rld":null,"vphone":"5791",
                    "cphone":"58-4709158","hr":"ea/accusantium/et","tf":"Administrator","userName":"Price70","mail":"Price70@jello.com"}
                ]
    };
}