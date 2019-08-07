const logger = require('./src/util/logger');
logger.error("test")
let dataSource = "aka1"
logger.log((()=>{return dataSource === "aka"?"warn":"error"})(),dataSource)