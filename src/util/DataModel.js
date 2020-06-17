const matchToKartoffel = require('./matchToKartoffel');
const completeFromAka = require('./completeFromAka');
const getIdentifiers = require('./getIdentifiers');

class DataModel {
    constructor(record, dataSource, flowType, runningType, deepDiffObj) {
        this.record = record;
        this.deepDiffObj = deepDiffObj;
        this.dataSource = dataSource;
        this.flowType = flowType;
        this.runningType = runningType;
        this.needMatchToKartoffel = true;
        this.isDataSourcePrimary = false;
        this.person_ready_for_kartoffel = null;
        this.person = null;
        this.akaRecord = null;
        this.entityType = null;
    }

    async matchToKartoffel() {
        if (this.needMatchToKartoffel) {
            this.person_ready_for_kartoffel = await matchToKartoffel(
                this.record,
                this.dataSource,
                this.flowType
            );
            this.needMatchToKartoffel = false;
            this.entityType = this.person_ready_for_kartoffel.entityType;
        }
    }

    completeFromAka(aka_all_data) {
        if (this.person_ready_for_kartoffel) {
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