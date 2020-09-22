const fn = require('../config/fieldNames');
const diffsHandler = require('../util/diffsHandler');
const preRun = require('../util/preRun');
const AuthClass = require('../auth/auth');



module.exports = async (dataSource, sourceRecords, akaRecords, runUID) => {
   
         const { sendLog } = await preRun(fn.runnigTypes.immediateRun, [], {}, runUID);

        const Auth = new AuthClass(sendLog);

        await diffsHandler({ added: sourceRecords }, dataSource, akaRecords, fn.runnigTypes.immediateRun, sendLog, Auth);

};
