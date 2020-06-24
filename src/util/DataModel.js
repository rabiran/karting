const matchToKartoffel = require('./matchToKartoffel');
const completeFromAka = require('./completeFromAka');

class DataModel {
    constructor(record, dataSource, flowType, runningType, updateDeepDiff) {
        this.record = record;
        this.updateDeepDiff = updateDeepDiff;
        this.dataSource = dataSource;
        this.flowType = flowType;
        this.runningType = runningType;
        this.identifiers = [];
        this.needMatchToKartoffel = true;
        this.needCompleteFromAka = true;
        this.isDataSourcePrimary = false;
        this.person_ready_for_kartoffel = null;
        this.person = null;
        this.akaRecord = null;
    }

    async matchToKartoffel() {
        if (this.needMatchToKartoffel) {
            this.person_ready_for_kartoffel = await matchToKartoffel(
                this.record,
                this.dataSource,
                this.flowType
            );
            this.needMatchToKartoffel = false;
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

    checkIfDataSourceIsPrimary(currentUnit_to_DataSource) {
        if (!this.needMatchToKartoffel) {
          this.isDataSourcePrimary = (currentUnit_to_DataSource.get(this.person_ready_for_kartoffel.currentUnit) === this.dataSource);
          return this.isDataSourcePrimary;
        }
    }
}

module.exports = DataModel;