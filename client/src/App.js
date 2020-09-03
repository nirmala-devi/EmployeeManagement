import React from 'react';
import Axios from 'axios';
import './App.css'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
        empId:'',
        firstName:'',
        surName:'',
        email :'',
        dob:'',
        gender :'',    
        hideEmpId:true,
        status:'Create New Employee',
        btnVl:'Create'
    };
    this.empApiUrl='http://localhost:5000/employee';
  }

  componentDidMount(){
    // Axios.get(this.empApiUrl).then(res=>res.data).then(rslt=>this.setState({rslt}))
  }

  changeHandler = event=>{
    let name = event.target.name;
    let value = event.target.value;
    this.setState({[name]: value});
   //alert(this.state.empId);
  }

 readUpdateDelEmp=(mode)=>{
  this.setState({ empId:'', firstName:'', surName:'',  email :'',  dob:'',  gender :'',   });
   this.setState({hideEmpId:false})  
   
   let elements = document.getElementsByTagName('a');
   for(let i=0;i<elements.length;i++){
     if(elements[i].id!==mode){
       //alert(elements[i].id)
      elements[i].style.backgroundColor='rgba(0, 45, 128, 0.603)';
      elements[i].style.color = "white";
     }else{
      elements[i].style.backgroundColor='white';
      elements[i].style.color='rgba(0, 45, 128, 0.603)';
     }   
   }
   switch(mode){
     case 'Read':
       this.setState({status: "Read Existing Employee"});
       this.setState({btnVl:"Read"})
       break;
      case 'Update' :
        this.setState({status: "Update Existing Employee"});
        this.setState({btnVl:"Update"})
        break;
      case 'Delete':
        this.setState({status: "Delete Existing Employee"});
        this.setState({btnVl:"Delete"})
        break;  
      default:
        this.setState({status:'Create New Employee' });
        this.setState({btnVl:"Create"})
        this.setState({hideEmpId:true})
   } 
 }

  addNewEmp =(event)=>{       
     let rst = this.callServer();
     console.log(rst) ;
  } 

  readEstEmp =(event)=>{
    const{empId} = this.state;
    //alert('empId',empId);
    var url = this.empApiUrl+'/'+ empId;    
    Axios.get(url).then((res)=>{
    console.log(res)       
    this.setState(res.data)
  },(error)=>{
    alert("Employee Id is not Exist");
    console.log(error)
  });
          
}

updateDelEmployee =(event) =>{
  const{empId} = this.state;
  var url = this.empApiUrl+'/'+ empId;
   switch(this.state.btnVl){
    case 'Update' :        
      const{firstName,surName,email,dob,gender} = this.state;
      Axios.put(url, {
        firstName,surName,email,dob,gender }).then((res)=>{
        console.log(res)      
        alert(" Successfully Updated Employee")
      },(error)=>{
        console.log(error)
      });
      break;
    case 'Delete':
      Axios.delete(url).then((res)=>{
        console.log(res)       
        alert('Employee Deleted')
        this.setState({ empId:'', firstName:'', surName:'',  email :'',  dob:'',  gender :'',   });
      },(error)=>{
        console.log(error)
      });
      break;  
    default:
      this.addNewEmp();
   }
}

async  callServer() {
  const{empId,firstName,surName,email,dob,gender} = this.state; 
  try{
    let result = await Axios.post(this.empApiUrl,{empId,firstName,surName,email,dob,gender });
    return result;
  }catch(err){
    //alert('Employee ID exist')
    console.log(err);
  }
  
}

  render(){
    const style = this.state.hideEmpId ?{display :'none'} :{display:'block' ,float:'right'};
   // const float ={float:'right'};
    const showBtn =  this.state.btnVl==="Read" ? {display:'none' }: {display:'block' ,float:'right'} ;       
    return (     
      <div className="App">
        <div className='App-header'>
        
        <h1>Employee Management</h1>
        <h3>Open Book Assignment by Nirmala</h3>
        <ul>
          <li><a href="#" id="Create"  onClick={this.readUpdateDelEmp.bind(this,'Create')}>Create</a></li>
          <li><a href="#" id="Read" onClick={this.readUpdateDelEmp.bind(this,'Read')}>Read</a></li>
          <li><a href="#" id="Update" onClick={this.readUpdateDelEmp.bind(this,'Update')}>Update</a></li>
          <li><a href="#" id="Delete" onClick={this.readUpdateDelEmp.bind(this,'Delete')}>Delete</a></li>
        </ul><br/>
        <hr/>
       </div>
       <div className='empDtl'>     
        <p>{this.state.status}</p>        
        <table class="readEmp">
        <tr>
           
            <td ><label for='emId'>Employee ID</label> &nbsp;&nbsp;&nbsp;</td>
             <td><input type='text' id='emId' name='empId'
                        value={this.state.empId}
                        onChange={this.changeHandler} required></input></td>
          </tr>
         <tr>
           <td></td>
           <td style={style}><input type='button' id='readBtn' value='Read' onClick={this.readEstEmp.bind(this)}/></td>
         </tr>     
       </table>   
        <hr/>    
         <table>          
           <tr>
             <td><label for='fstNm'>First Name</label> &nbsp; </td>
             <td><input type='text' id='fstNm' name='firstName'
                        value={this.state.firstName}
                        onChange={this.changeHandler} required>
              </input></td>
           </tr>
           
           <tr>
             <td><label for='lastNm'>Last Name</label>&nbsp; </td>
             <td><input type='text' id='lastNm' name='surName' 
                    value={this.state.surName}
                    onChange={this.changeHandler} required></input>
              </td>
            </tr>

            <tr>
              <td> <label for='email'>Email</label>&nbsp; </td>
              <td> <input type='email' id='email' name='email' 
                    value={this.state.email}
                    onChange={this.changeHandler} required></input>
               </td>
            </tr>     

            <tr>
              <td> <label for='dob'>Date of Birth</label>&nbsp;  </td>
              <td><input type='date' id='dob'name='dob' 
                    value={this.state.dob}
                    onChange={this.changeHandler} ></input></td>
            </tr>

            <tr>
               <td> <label for='gender'>Gender</label> &nbsp; &nbsp; </td>
               <td>                
                 <input type ='radio' id='male' name='gender' 
                    value='Male' checked={this.state.gender==='Male'}
                    onChange={this.changeHandler}/>Male&nbsp; &nbsp; 
                <input type ='radio' id='female' name='gender'
                    value='Female' checked={this.state.gender==='Female'}
                    onChange={this.changeHandler}/>Female </td>
            </tr>

            <tr>
            
                <td></td>
                <td><input type='button' style={showBtn} value={this.state.btnVl} id='create'
                 onClick={this.updateDelEmployee}/></td>
  <br/>
             </tr>    
          </table>
       </div>
      
      </div>
    );
  }
}

export default App;
