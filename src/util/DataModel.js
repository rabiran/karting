const matchToKartoffel = require('./matchToKartoffel');
const completeFromAka = require('./completeFromAka');
const currentUnit_to_DataSource = require('./createDataSourcesMap');

class DataModel {
    constructor(record, dataSource, flowType, runningType, Auth, sendLog, updateDeepDiff) {
        this.record = record;
        this.updateDeepDiff = updateDeepDiff;
        this.dataSource = dataSource;
        this.flowType = flowType;
        this.runningType = runningType;
        this.identifiers = [];
        this.isMatchToKartoffel = true;
        this.isCompleteFromAka = true;
        this.isDataSourcePrimary = false;
        this.person_ready_for_kartoffel = null;
        this.person = null;
        this.akaRecord = null;
        this.sendLog = sendLog;
        this.Auth = Auth;
    }

    async matchToKartoffel() {
        if (this.isMatchToKartoffel) {
            this.person_ready_for_kartoffel = await matchToKartoffel(
                this.record,
                this.dataSource,
                this.Auth,
                this.sendLog,
                this.flowType
            );
            this.isMatchToKartoffel = false;
        }
    }

    completeFromAka(aka_all_data) {
        if (this.person_ready_for_kartoffel) {
            this.person_ready_for_kartoffel = completeFromAka(
                this.person_ready_for_kartoffel,
                aka_all_data,
                this.dataSource,
                this.sendLog
            );
            this.needCompleteFromAka = false;
        }
    }

    checkIfDataSourceIsPrimary(unitName) {
        this.isDataSourcePrimary = (currentUnit_to_DataSource.get(unitName) === this.dataSource);
        return this.isDataSourcePrimary;
    }
}

module.exports = DataModel;