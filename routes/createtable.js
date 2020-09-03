var aws = require('aws-sdk');

aws.config.update({
    region:'ap-southeast-2',
    accessKeyId: 'fakeMyKeyId',      
    accessSecretKey: 'fakeSecretAccessKey', 
    endpoint:"http://localhost:8000"
});
var dynamoDB = new aws.DynamoDB();
var params = {
    TableName : 'Employee',
    KeySchema: [     
        {AttributeName:"empId",KeyType:"HASH"}  //Primary key
        
    ],
    AttributeDefinitions: [       
        { AttributeName: "empId", AttributeType: "N" }
        ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};
dynamoDB.createTable(params,function(err,data){
    if(err){
        console.log("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    }else{
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
 
    }
});
