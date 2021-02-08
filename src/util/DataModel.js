const matchToKartoffel = require('./matchToKartoffel');
const completeFromAka = require('./completeFromAka');
const completeFromCity = require('./completeFromCity');
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
    
    complete(aka_all_data,city_all_data){
        const identifier = this.person_ready_for_kartoffel.personalNumber || this.person_ready_for_kartoffel.identityCard;
        const akaRecord = aka_all_data.find(person => ((person[fn.aka.personalNumber] == identifier) || (person[fn.aka.identityCard] == identifier)));
        if(akaRecord){
            this.person_ready_for_kartoffel = completeFromAka(
                this.person_ready_for_kartoffel,
                akaRecord,
                this.dataSource,
                this.sendLog
        );
        }
        else{
            const cityRecord = city_all_data.find(person => ((person[fn.city_name.personalNumber] == identifier) || (person[fn.city_name.identityCard] == identifier)));
            if(cityRecord){
                this.person_ready_for_kartoffel = completeFromCity(
                    this.person_ready_for_kartoffel,
                    cityRecord
            );
            }
            else{
                //send warning not completed
                sendLog(logLevel.error, logDetails.error.WRN_COMPLETE, identifier, this.dataSource)

            }
        }

        this.needComplete = false;
    }

    checkIfDataSourceIsPrimary(unitName) {
        this.isDataSourcePrimary = (currentUnit_to_DataSource.get(unitName) === this.dataSource);
        return this.isDataSourcePrimary;
    }
}

module.exports = DataModel;