messageLog = {
    error: {
        ERR_CONNECTION_REDIS: 'Failed to connect to Redis. error message: %s',
        ERR_SPIKE_TOKEN: 'Error from spike: %s',
        ERR_ADD_ROOT: 'Failed to add the root hierarchy to Kartoffel. the error message: %s',
        ERR_DATA_SOURCE: '"dataSource" variable must be attached to "completeFromAka" function',
        ERR_READ_PREVIOUS_DATA_FILE: 'Reading the previous data file: %s failed. The error message: %s',
        ERR_INSERT_PERSON: 'Not insert the person with the identifier: %s from %s to Kartoffel. The error message: "%s" %s',
        ERR_ADD_FUNCTION_PERSON_NOT_FOUND: 'The person with the identifier: %s from %s_raw_data not found in Kartoffel at added flow. The error message:"%s"',
        ERR_ADD_DOMAIN_USER: 'Not add the domain user: %s to the person with the idetifier: %s from %s. The error message:"%s"',
        ERR_ADD_HIERARCHY: 'failed to add the hierarchy "%s" to Kartoffel. the error message: "%s"',
        ERR_ADD_DIRECT_GROUP_TO_PERSON: 'Faild to add directGroup to the person with the identityCard: %s. The error message:"%s"',
        ERR_UNIDENTIFIED_DATA_SOURCE: '"dataSource" variable must be attached to "matchToKartoffel" function',
        ERR_SAVE_DATA_FILE: 'Error at save %s_%s.log file. The error message: %s',
        ERR_UPDATE_DIRECT_GROUP_TO_PERSON: 'Failed to update directGroup for %s from %s. The error message:"%s" %s',
        ERR_UPDATE_FUNC_PERSON_NOT_FOUND: 'Failed to get data from Kartoffel about the person with the identifier %s from "%s" at update flow. The error message: "%s"',
        ERR_GET_RAW_DATA: 'Failed to get data from %s API. The error is: %s',
        ERR_GET_ALL_FROM_KARTOFFEL: 'Failed to get data from Kartoffel, in % The error message is: %s',
        ERR_TRANSFER_DOMAIN_USER: 'Failed to transfer domain user: %s FROM person with identifier: %s TO person with identifier: %s from data source %s',
        ERR_UN_HANDLED_ERROR: 'FATAL ERORR!!! on %s. the error is: %s',
        ERR_UNKNOWN_ERROR: 'Unknown Error at %s flow the error is: %s',
        ERR_NO_IDENTIFIERS_TO_UPDATE: 'there is no identifiers to the record: %s at update flow from "%s"',
        ERR_NOT_FIND_PERSON_AT_UPDATE: 'The person with identifiers %s from %s does not exists in kartoffel at UPDATE flow',
        ERR_DELETE_DOMAIN_USER: 'Cannot delete the domainUser %s from the person with identifier %s from %s the error message is: %s',
        ERR_SERVER_INVALID_INPUT: 'Invalid request from server, the request body is %s on %s',
        ERR_NOT_FOUND_IN_RAW_DATA: 'The person with identifier %s from %s does not exists in raw data',
        ERR_UNRECOGNIZED_DATA_SOURCE: 'Unrecognized dataSource at %s, the dataSource is: %s, the record is: %s',
        ERR_GET_PERSONS_BY_DU: 'Failed to get persons by domain user of %s from datasource %s from kartoffel. The error is: %s',
        ERR_GET_PERSONS_BY_ID: 'Failed to get persons by identifier of %s from datasouce %s from kartoffel. The error is: %s',
        ERR_WRONG_MESSAGE_FROM_KAFKA: 'Recived invalid message from kafka. topic: %s, message: %s, the error message is: %s. The error message is: %s',
        ERR_CONNECTING_TO_KAFKA: 'Cannot connect to kafka. topic: %s',
        ERR_REMOVE_GROUP_FROM_KARTOFFEL: 'Cannot delete groups with id %s from kartoffel. The error message: %s',
    },
    warn: {
        WRN_COMPLETE: 'The person with the identifier %s from %s not complete from aka or city',
        WRN_MISSING_IDENTIFIER_PERSON: 'There is no identifier to the person: %s, the record is: %s from %s',
        WRN_NOT_UPDATE_IN_KARTOFFEL: 'The person from:"%s" with the identifier %s not updated in kartoffel because the dataSource: "%s" is not match to the person\'s currentUnit: "%s", the fields are: %s',
        WRN_AKA_FIELD_RIGID: 'The field "%s" of the person with the identifier %s from the dataSource "%s" is not update because is rigid to Aka',
        WRN_IDENTIFIER_FIELD_REDUNDANT: 'The identifier fields of the person %s are equals, the "%s" field was deleted',
        WRN_NOT_INSERTED_ENTITY_TYPE: 'Not inserted entity type for the user with the upn %s from ads',
        WRN_USER_NOT_EXTENTION: 'User with id %s is not %s extension',
        WRN_PERSON_HAS_NOT_HAVE_USERPRINCIPALNAME: 'To the person with the identifier: %s has not have "userPrincipalName" field at ads',
        WRN_KIND_DEEPDIFF_NOT_RECOGNIZED: 'the deepDiff kind of the updated person is not recognized -"%s"',
        WRN_UNRECOGNIZED_ENTITY_TYPE: 'There is no entity type for the person %s from %s',
        WRN_IRRELEVANT_TAGS: 'Irrelevant tags for the record %s from %s',
        WRN_IRRELEVANT_DOMAIN: 'Local domain for the record %s from %s',
        WRN_FIND_GROUP_BY_AKA_UNIT: 'The group for aka unit: %s, does not exist in kartoffel',
        WRN_MISSING_DIRECT_GROUP: 'There is no directGroup for the person with identifiers: %s from %s the record is: %s',
    },
    info: {
        INF_CONNECT_REDIS: 'Redis connect to service',
        INF_SET_TOKEN: 'Success to set access token in redis',
        INF_CLOSED_REDIS: 'The connection to Redis is closed',
        INF_ROOT_EXSIST: 'The root hierarchy %s already exist in Kartoffel',
        INF_ADD_ROOT: 'Success to add the root hierarchy %s to Kartoffel',
        INF_ADD_PERSON_TO_KARTOFFEL: 'The person with the identifier: %s from %s successfully insert to Kartoffel',
        INF_ADD_DOMAIN_USER: 'Add the domain user "%s" to the person with the idetifier: %s from %s successfully.',
        INF_ADD_HIERARCHY: 'success to add the hierarchy "%s" to Kartoffel',
        INF_SAVE_NEW_DATA_FILE: 'The %s from %s successfully saved',
        INF_MOVE_FILE_TO_ARCHIVE: '%s successfully moved to the archive',
        INF_UPDATE_DIRECT_GROUP_TO_PERSON: 'The directGroup of the person with the identifier: %s from %s update successfully. %s',
        INF_UPDATE_PERSON_IN_KARTOFFEL: 'The person with the identifier: %s from %s update successfully. %s',
        INF_DELETE_DOMAIN_USER: 'The domain user %s from %s successfully removed from the person with identifier: %s',
        INF_TRANSFER_DOMAIN_USER: 'The domain user: %s successfully transfer FROM person with identifier: %s TO the person with identifier: %s from %s',
        INF_CONSUME_FROM_KAFKA: 'Recive message successfuly from kafka. topic: %s, message: %s',
        INF_REMOVE_GROUP_FROM_KARTOFFEL: 'Group with id %s was successfully hidden from kartoffel'
    },
};

// Override get
const getHandler = {
    get: function (obj, prop) {
        return { title: prop, message: obj[prop] }
    },
};

// Execute override get on messageLog object
module.exports = Object.keys(messageLog).reduce(
    (prevObj, currKey) => {
        prevObj[currKey] = new Proxy(messageLog[currKey], getHandler);
        return prevObj;
    },
    {}
);