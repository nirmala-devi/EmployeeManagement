const express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');

var table = "Employee";

AWS.config.update({
    region:'ap-southeast-2',
    endpoint:"http://localhost:8000"
});
var docClnt = new AWS.DynamoDB.DocumentClient();


//Create employee
router.post('/',function(req,res){
  
   var empId = Number(req.body.empId);

    var firstName = req.body.firstName;
    var surName = req.body.surName;
    var email = req.body.email;
    var dob = req.body.dob;
    var gender = req.body.gender;
    
    if(isNaN(empId)){
        console.log("employee id is not valid");
        res.sendStatus(400);
        return "employee id is not valid";
    }       
    var params ={
        TableName:table,        
        Item:{
            "empId":empId,
            "info":{
                "firstName":firstName,
                 "surName":surName,
                  "email": email,
                  "dob":dob,
                   "gender":gender
            }
        },
        ConditionExpression:"attribute_not_exists(empId)"        
    };
    
    docClnt.put(params,function(err,data){
        if(err){
            console.log("Unable to add Employee",firstName,err);
            res.sendStatus(500);
        }else{
            console.log("Employee created Successfully ",firstName,"with EmpId ",empId);
            console.log(JSON.stringify(data,null,2))   ;
           // res.status(201) ;     
            getEmployee(empId,res,201);            
        }
    });
   
})

//This method returns Employee for given employee id
router.get('/:id',function(req,res){
    var empId = Number(req.params.id);
    getEmployee(empId,res,200);      
   })

//Update employee
router.put("/:id",function(req,res){
    var empId = Number(req.params.id);
    var params={
        TableName:table,
        Key:{
            "empId":empId
        },
        UpdateExpression: "set info.firstName = :f, info.surName=:s, info.email=:e, info.dob=:d, info.gender=:g",
        ExpressionAttributeValues:{
            ':f' :req.body.firstName,
            ':s':req.body.surName,
            ':e' :req.body.email,
            ':d': req.body.dob,
            ':g' :req.body.gender
        },
        ReturnValues:"UPDATED_NEW"        
    };
    docClnt.update(params,function(err,data){
        if(err){
            res.sendStatus(400);
            console.log("Unable to update Employee",empId,JSON.stringify(err,null,2))
        }else{
            res.status(200).json(data)
            console.log("Successfully updated",JSON.stringify(data,null,2))
        }
    });
});

//Delete Employee
router.delete('/:id',function(req,res){
    var empId =  Number(req.params.id);
    var params ={
        TableName:table,
        Key:{
            'empId':empId
        }
    }
    docClnt.delete(params,function(err,data){
        if(err){
            res.sendStatus(400)
            console.log("Unable to Dlete Employee",JSON.stringify(err,null,2))
        }else{
            res.sendStatus(204);
            console.log("Dleted the employee",empId,JSON.stringify(data,null,2))
        }
    })
})

//Fetch a employee from DB
function getEmployee(empId,res,status){
    var employee;
    var params={
        TableName:table,
        Key:{
            "empId":empId
        }
    };
    docClnt.get(params,function(err,data){
        
        if(err){
            console.log("Unable to read Employee",JSON.stringify(err,null,2));
            res.sendStatus(404);
        }else{            
            if(data.Item!=undefined){
                var info = data.Item.info;
                employee = {empId: data.Item.empId,firstName:info.firstName,
                    surName:info.surName,gender:info.gender,email:info.email,dob:info.dob}                
    
                res.status(status).json(employee);
                console.log("successfully Read Employee ",JSON.stringify(data,null,2));
               
            }else{               
                console.log("There is no employee for given Id");
            }
            
        }
        
    })
    return employee;
}
module.exports = router;