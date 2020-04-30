const matchToKartoffel = require('./matchToKartoffel');
const completeFromAka = require('./completeFromAka');
const Auth = require('../auth/auth');
const fn = require('../config/fieldNames')
const tryArgs = require('./generalUtils/tryArgs');

class DataModel {
    constructor(record, dataSource, flowType, deepDiffRecord) {
        this.record = record;
        this.deepDiffRecord = deepDiffRecord;
        this.dataSource = dataSource;
        this.flowType = flowType;
        this.needMatchToKartoffel = true;
        this.isDataSourcePrimary = false;
        this.identifiers = [];
        this.person_ready_for_kartoffel = null;
        this.person = null;
        this.akaRecord = null;
        this.entityType = null;
    }

    async matchToKartoffel() {
        if (this.needMatchToKartoffel) {
            this.person_ready_for_kartoffel = await matchToKartoffel(
                this.record,
                this.dataSource
            );
            this.needMatchToKartoffel = false;
        }
    }

    completeFromAka(aka_all_data) {
        if (
            this.person_ready_for_kartoffel
        ) {
            this.person_ready_for_kartoffel = completeFromAka(
                this.person_ready_for_kartoffel,
                aka_all_data,
                this.dataSource
            );
            this.needCompleteFromAka = false;
        }
    }
}

module.exports = DataModel;