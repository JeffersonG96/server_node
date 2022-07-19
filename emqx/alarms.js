const { response } = require("express");
const axios  = require('axios');

const auth = {
    auth: {
        username: 'admin',
        password: 'jg0411'
    }
};


const createAlarmRule = async(req, res=response) => {

    const uid = req.body;
    const _id = uid.uid;
    const userId = uid.uid;
    console.log(uid);
    ///////
    const dId = uid.dId;
    const variable = uid.variable;
    const condition = uid.condition;
    const value = uid.value;
    const variableFullName = uid.variableFullName;
    const triggerTime = uid.triggerTime;

const url = "http://192.168.100.149:8085/api/v4/rules";
// topicExample = userid/did/temp  //msgExample = {value: 20}
const topic = userId + "/" + dId + "/" + variable + "/sdata";

const rawsql = "SELECT username, topic, payload FROM \"" + topic + "\" WHERE payload.value "  + condition + " " + value + " AND is_not_null(payload.value)";

var newRule = {
    rawsql: rawsql,
    actions: [
        {
        name: "data_to_webserver",
        params: {
            $resource: global.alarmResource.id,
            payload_tmpl: '{"userId": "' + userId + '","payload":${payload}, "topic":"${topic}"  }'
        }
    }
],
description: "ALARM-RULE",
enabled: status
};

 //*Guardar regla en emqx
 const resp = await axios.post(url, newRule, auth);
 console.log(res.addTrailers.data);
//Guardar en Mongo
 if(resp.status === 200 && resp.data.data){
    console.log(res.data.data);

    const mongoRule= await alarmRule.create({
        userId: userId,
        dId: 'dId',
        emqxRuleId: res.data.data.id,
        variableFullName: 'fullName',
        variable: 'variable',
        value: 'value',
        condition: 'condition',
        triggerTime: 0,
        status: true,
        counter: 0, 
        time: Date.now()
    });


    const url = "http://192.168.100.149:8085/api/v4/rules/" + mongoRule.emqxRuleId;

    const payload_templ = '{"userId":"' + userId + '","dId":"' + dId + '","payload":${payload},"topic":"${topic}","emqxRuleId":"' + mongoRule.emqxRuleId + '","value":' + value + ',"condition":"' + condition + '","variable":"' + variable + '","variableFullName":"' + variableFullName + '","triggerTime":' + triggerTime + '}';

    newRule.actions[0].params.payload_tmpl = payload_templ;

    const res = await axios.put(url, newRule, auth);

    console.log("Regla de alarma creada");

    return true;

    return true;
} else {
    return false;
}

 
}//createAlarmRule

module.exports = createAlarmRule;

