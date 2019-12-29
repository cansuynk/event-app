import React, {useState} from 'react';
import axios from "axios"
import './Eventpage.css';
import {
    Calendar,
    DateLocalizer,
    momentLocalizer,
    globalizeLocalizer,
    move,
    Views,
    Navigate,
    components,
  } from 'react-big-calendar'
import moment from '../node_modules/moment';
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);



//react-big-calendar diye bir takvim modulu kullandim, event verisini asagidaki sekilde aliyordu denemek icin yazdim

//Random avatars for people in the contact list
//It is necessary, dont delete
const avatar = [
    "https://picturepan2.github.io/spectre/img/avatar-1.png", "https://picturepan2.github.io/spectre/img/avatar-2.png", "https://picturepan2.github.io/spectre/img/avatar-3.png",
    "https://picturepan2.github.io/spectre/img/avatar-4.png", "https://picturepan2.github.io/spectre/img/avatar-5.png", "https://img.icons8.com/plasticine/100/000000/user-male-circle.png",
    "https://img.icons8.com/bubbles/50/000000/guest-male.png","https://img.icons8.com/dusk/64/000000/user-female-circle.png","https://img.icons8.com/color/48/000000/user-female-circle.png"
];

class Eventpage extends React.Component {
    constructor() {
        super();
        this.state = {
           contacts:[],
           addContactDiv:"",
           newContactName:"",
           newContactEmail:"",
           newContactPhone:"",
           calendar_data: [],
           emails:[],
           phones:[],
           eventTitle:"",
           eventDate:"",
           eventDescription:"",
           invitations: [],
           profileContent:"profile",
           events:[]
 
        }
   
        this.deleteContact = this.deleteContact.bind(this);
        this.change = this.change.bind(this);
        this.addContact = this.addContact.bind(this);
        this.closeContactDiv = this.closeContactDiv.bind(this);
        this.saveContact = this.saveContact.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEventChange = this.handleEventChange.bind(this);
        this.contactE = this.contactE.bind(this);
        this.contactP = this.contactP.bind(this);
        this.handleSendSubmit = this.handleSendSubmit.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.logout = this.logout.bind(this);
    }  

    handleSelect = (e) => {
      let array = this.state.invitations
      array.indexOf(e.target.value) === -1 ? array.push(e.target.value) : console.log("This item already exists");
      this.setState({
        invitations: array
      })

    }
    
   componentDidMount() {
      axios({
          method: 'get',
          url: '/get_events',
      }).then(res => {
          if (res.data.code === 200) {
              this.setState({
                events: res.data.data
              })
              let data = []
              for(let i = 0 ; i <  res.data.data.length; i++ ) {
                data.push({
                  'title': res.data.data[i]["eventtitle"] ,
                  'start': new Date(res.data.data[i]["eventdate"]),
                  'end': new Date(res.data.data[i]["eventdate"]),
                })
                console.log(data)
                
              }
              this.setState({
                calendar_data: data
              })
              
          }
      }).catch( err => {
          alert(err)
      })
      axios({
        method: 'get',
        url: '/get_contacts',
      }).then(res => {
          if (res.data.code === 200) {
              this.setState({
                contacts: res.data.data
              })
          }
      }).catch( err => {
          alert(err)
      })
   }
   addContact(){
       //add contact butonuna basinca yeni kisi eklemek icin pop-up tarzi bir sey cikariyor.
       //isim, email, tel girilmesi icin forum var burada.
       //save butonuna basinca "saveContact" fonksiyonu cagrilir

       let content = <div className="modal active" id="example-modal-1">
    <a className="modal-overlay" href="#modals" aria-label="Close"></a>
    <div className="modal-container" role="document">
      <div className="modal-header">
        <div className="modal-title h5" style={{textAlign:"center"}}>Add a New Contact</div>
      </div>
      <div className="modal-body">
      <form className="form-horizontal" action="#forms" onSubmit={this.saveContact}>
				<div className="form-group">
                    <div className="col-3">
                      <label className="form-label" for="input-example-12">Name:</label>
                    </div>
                    <div className="col-9">
                      <input className="form-input" name="newContactName" onChange={this.handleChange} id="input-example-12" type="text" placeholder="Name"/>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-3">
                      <label className="form-label" for="input-example-8">Email:</label>
                    </div>
                    <div className="col-9">
                      <input className="form-input"  name="newContactEmail" onChange={this.handleChange} id="input-example-8" type="email" placeholder="Email" pattern="[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"/>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-3">
                      <label className="form-label" for="input-example-11">Tel:</label>
                    </div>
                    <div className="col-9">
                      <input className="form-input"  pattern="\d*"   name="newContactPhone" id="input-example-11" type="tel" placeholder="Ex. 905385685318" onChange={this.handleChange}/>
                    </div>
                  </div>
                  <div className="form-group">
                <div className="btn-group btn-group-block">
                <button className="btn btn-primary btn-lg" aria-label="Save" type="submit">Save</button>
                </div>
              </div>
                </form>
        
      
      </div>
      <div className="modal-footer">
         <button onClick={this.closeContactDiv} className="btn btn-primary btn-lg" aria-label="Close">Close</button>
    </div>
    </div>
  </div>
    this.setState({
        addContactDiv:content
    })
   }
   changeTab(param){
       //Profili tablardan olusturdum. Bu profilin icerigi degistirmeye yariyor
        this.setState({profileContent:param})
   }
   handleChange(e) {
       //yeni contact eklerken inputlarda value ları almak icin
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleEventChange(e) {
        //Event yollarken girilen inputlari almak icin
        this.setState({
            [e.target.name]: e.target.value
        });
    }

   saveContact(params){
       //Yeni contacti state e pushlamak icin
       //"contacts" state i kisilerin bilgilerini tutan bir array
        let newContact = {
            name:this.state.newContactName,
            email:this.state.newContactEmail,
            phone:this.state.newContactPhone
        }
        axios({
          method: 'post',
          url: '/add_contact',
          data: newContact
          }).then(res => {
              if (res.data.code !== 200) {
                alert(res.data.detail)
              }  else {
                window.location.reload();
              }
          }).catch( err => {
              alert(err)
          })

        /*
        data.push(newContact);
        this.setState({
            contacts:data
        })
        */
        this.closeContactDiv();
   }
   closeContactDiv(){
       //Yeni contact eklemek icin cikan pop-up kapamaya yariyor ve stateleri bosaltiyor
    let content = ""
    this.setState({addContactDiv: content})
    this.setState({
        newContactName: "",
        newContactEmail: "",
        newContactPhone: "",
    });
    }
   change(param){
       //Kisinin profilindeki email, tel, location gibi bilgileri editlemesi icin.
       //ben 2 ekstra bilgi daha koydum (skype, location) istersen sil farketmez.

       if(this.refs.email.value!=="")
        this.setState({
            email: this.refs.email.value,
        })
        if (this.refs.phone.value!=="")
        this.setState({
            phone: this.refs.phone.value
        })
        if (this.refs.skype.value!=="")
        this.setState({
            skype: this.refs.skype.value
        })
        if (this.refs.location.value!=="")
        this.setState({
            location: this.refs.location.value
        })

   }

   deleteContact(element){
       //Contact taki carpi butonuna basinca, silinmesi icin yazilan bir fonksiyon
       var name_tobe_deleted = element.name
       axios({
        method: 'post',
        url: "/delete_contact",
        data: {
            name: name_tobe_deleted
        }
        }).then((res) => {
            if (res.data.code === 200) {
                window.location.reload();
            } else {
                alert(res.data.detail);
            }
        }).catch((err) =>  {
            alert(err);
        })
   }
   deleteEvent(element){
       //eventlerin silinmesi icin yazildi
    var id = element.event_id

    axios({
      method: 'post',
      url: "/delete_event",
      data: {
         event_id : id
      }
      }).then((res) => {
          if (res.data.code === 200) {
              window.location.reload();
          } else {
              alert(res.data.detail);
          }
      }).catch((err) =>  {
          alert(err);
      })
   }
    //event olustururken email ve tel secimi icin contact listesinden istenilen email ve teli ayri ayri secilebilir yaptım
    //email veya tel secilince event yollama kismindaki bölüme emailler ve teller tek tek geliyor.
    //istenirse ordan silinebilir
   deleteEmail(element){
      //bu secilen emailleri event yollama kismindan silmeye yarıyor
        var emailarray = this.state.emails 
        var index = emailarray.findIndex(obj => obj.email===element.email);
        emailarray.splice(index,1);
  
        this.setState({
            emails:emailarray
        })
   }
   deletePhone(element){
        //bu secilen telleri event yollama kismindan silmeye yarıyor
        var phonearray = this.state.phones 
        var index = phonearray.findIndex(obj => obj.phone===element.phone);
        phonearray.splice(index,1);
  
        this.setState({
            phones:phonearray
        })
   }
   contactE(element){
       //event yollanmasi icin secilen emailleri tutan array
       let emailarray = this.state.emails
       emailarray.push(element)
       this.setState({
           emails:emailarray
       })
   }
   contactP(element){
       //event yollanmasi icin secilen telleri tutan array
    let phonearray = this.state.phones
    phonearray.push(element)
    this.setState({
         phones:phonearray
    })
    }
   handleSendSubmit(e){
     e.preventDefault()
    let newEvent ={
        title:this.state.eventTitle,
        date: this.state.eventDate,
        description:this.state.eventDescription
    }

    axios({
      method: 'post',
      url: "/create_event",
      data: newEvent
      }).then( async (res) => {
          if (res.data.code === 200) {
              for(let i = 0 ; i < this.state.invitations.length; i++) {
                  let picked = this.state.contacts.find(o => o.name === this.state.invitations[i]);
                  picked.event_id = res.data.data
                  picked.message = "Join my event on " + this.state.eventDate + " \n\n " +  this.state.eventDescription

                  res = await axios({
                    method: 'post',
                    url: "/add_participant",
                    data: picked
                    })

                  if (res.data.code !==  200) {
                    alert(res.data.detail)
                  }
            }
           
          alert("SuccessFully Created!")
            window.location.reload();
          } else {
              alert(res.data.detail);
          }
      }).catch((err) =>  {
          alert(err);
      })
   }
   logout(e){
     e.preventDefault()
      axios({
        method: 'get',
        url: "/auth/logout"
      }).then((res) => {
          if (res.data.code === 200) {
              window.location.reload();
          }
      }).catch((err) =>  {
          alert(err);
      })
   }
    
    render() {
       
        return (
            
            <div className="flex-centered"> 
           
            <div className="card">
                  
                <div className="header">                              
                    <p>My Event Scheduler</p> 
                </div> 
                <div className="container">
                <div className="docs-demo columns">
                <div className="column col-4 col-xs-12">

                <div className="content" style={{background:"#5755d9"}}> 
                <div className="panel">
                  <div className="panel-header text-center" >
                    <figure className="avatar avatar-lg"><img src="https://picturepan2.github.io/spectre/img/avatar-1.png" alt="Avatar"/></figure>
                    <div className="panel-title h5 mt-10">{this.props.username}</div>
                  </div>
                  {this.state.profileContent==="profile"?<div><nav className="panel-nav">
                    <ul className="tab tab-block">
                      <li className="tab-item active" onClick={() => this.changeTab("profile")}>Profile</li>
                      <li className="tab-item" onClick={() => this.changeTab("list")}>Event List</li>
                      <li className="tab-item" onClick={() => this.changeTab("calendar")}>Calendar</li>
                    </ul>
                  </nav>
                  <div className="panel-body" style={{height:"200%"}}>
                    <div className="tile tile-centered">
                      <div className="tile-content">
                        <div className="tile-title text-bold">E-mail</div>
                        <div className="tile-subtitle">{this.props.email}</div>
                      </div>
                      
                    </div>
                    <div className="tile tile-centered">
                      <div className="tile-content">
                        <div className="tile-title text-bold">Phone Number</div>
                        <div className="tile-subtitle">{this.props.phone}</div>
                      </div>

                    </div>
                    
                  
                  </div>
                  </div>:this.state.profileContent==="list"?<div><nav className="panel-nav">
                    <ul className="tab tab-block">
                      <li className="tab-item" onClick={() => this.changeTab("profile")}>Profile</li>
                      <li className="tab-item active" onClick={() => this.changeTab("list")}>Event List</li>
                      <li className="tab-item" onClick={() => this.changeTab("calendar")}>Calendar</li>
                    </ul>
                  </nav>
                  <div className="panel-body" style={{height:"200%"}}>
                  {
                        this.state.events.map((item,key)=>
                        <div> 
                         <details className="accordion" >
                        <summary className="accordion-header" style={{ border:"1px solid blue"}}>
                          <i className="icon icon-arrow-right mr-1"></i>
                          {item.eventtitle}
                          <button style={{float:"right" ,border:"none", background:"none"}} className="btn btn-sm tooltip tooltip-left" data-tooltip="Delete Event" onClick={() => this.deleteEvent(item)}>x</button>
                        </summary>
                        <div className="accordion-body" style={{overflow:"scroll"}}>
                        
                            
                            <strong>Date:</strong> {item.eventdate}<br></br>
                            <strong>Description: </strong> {item.eventdescription}<br></br>
                           
                     
                        </div>
                      </details>
                      <hr/>
                      </div> 
                       
                    
                    )}

                  </div>
                  </div>:<div><nav className="panel-nav">
                    <ul className="tab tab-block">
                      <li className="tab-item" onClick={() => this.changeTab("profile")}>Profile</li>
                      <li className="tab-item" onClick={() => this.changeTab("list")}>Event List</li>
                      <li className="tab-item active" onClick={() => this.changeTab("calendar")}>Calendar</li>
                    </ul>
                  </nav>
                  <div className="panel-body" style={{height:"200%"}}>
                  <Calendar
                    style={{ height: 500 }}
                    localizer={localizer}
                    events={this.state.calendar_data}
                    step={60}
                    views={["month"]}
                    onView={() => {}}
                    />
                  </div>
                  </div>}
                  
                  <div className="panel-footer">
                  <button className="btn btn-primary btn-block" onClick={this.logout}>Logout</button>
                  </div>

                </div>

                </div> 
                </div> 

                <div className="column col-4 col-xs-12">
                <div className="content" style={{background:"#5755d9"}}> 
                <div className="panel">
                  
                <div className="panel-header text-center" >
                <p className="panel-title h5 mt-10">My Contact List</p></div>
                  
                  <div className="panelBody">
                  <div className="panel-body">

                    {
                        this.state.contacts.map((item,key)=>
                        <div>
                            <div className="tile" id="btn">
                            <div className="tile-icon" style={{textAlign:"center"}}>
                            <figure className="avatar"><img src={avatar[this.state.contacts.indexOf(item)%avatar.length]} alt="Avatar"/></figure>
                            <div className="tile-title text-bold">{item.name}</div>
                            </div>
                            <div className="tile-content">
                            <div className="columns">
                            <div className="column col-10 col-xs-6" >
                            <button id="contactBtn" style={{border:"1px solid #6866e2d1"}} className="column col-12 col-xs-12" onClick={() => this.contactE(item)}>
                            <div className="tile-subtitle text-bold">Email</div>
                            <div className="tile-subtitle">{item.email}</div>
                            </button>
                            <button  id="contactBtn" style={{border:"1px solid #6866e2d1"}} className="column col-12 col-xs-12" onClick={() => this.contactP(item)}>
                            <div className="tile-subtitle text-bold">Phone</div>
                            <div className="tile-subtitle">{item.phone}</div>
                            </button>
                            </div>
                            <div className="column col-2 col-xs-6">
                            <button className="btn btn-error tooltip tooltip-left" data-tooltip="Delete Contact" onClick={() => this.deleteContact(item)}>X</button>
                            </div>
                            </div>
                            </div>
                            </div>
                        <hr style={{color:"#5755d9"}}/>
                        </div>
                        ) 
                    }                 
                  </div>
                  </div>
                  <div className="panel-footer">
                  <div className="btn-group btn-group-block">
                        <button className="btn btn-primary btn-lg" id= "sendemail_button" type="submit" onClick={this.addContact}>Add a Contact</button>
                    </div>
                  </div>
                </div>
             
                    
                </div> 
                </div>

                <div className="column col-4 col-xs-12">
                <div className="content" style={{background:"#5755d9", padding:"1%"}}> 
                {this.state.addContactDiv}

                <div className="panel">
                <div className="panel-header text-center" >
                <p className="panel-title h5 mt-10">Create an Event</p></div>
                <form className="form-horizontal" onSubmit={this.handleSendSubmit}>
                <div className="form-group">
                <div className="col-3 col-sm-12">
                    <label className="form-label"><h5>Event Title: </h5></label>
                </div>
                <div className="col-9 col-sm-12">
                    <input className="form-input" id="title"
                        type="text"
                        placeholder="Title"
                        name="eventTitle"
                        onChange={this.handleEventChange}
                    />
                </div>
                </div>
                <div className="form-group">
                <div className="col-3 col-sm-12">
                    <label className="form-label" ><h5>Invite: </h5></label>
                    
                </div>
                <div class="form-group">
                    <select onChange={this.handleSelect}  name="invitations" value={this.state.invitations} multiple class="form-select">
                      {
                       this.state.contacts.map((item, key) => {
                         return <option key={key}> {item.name}  </option>
                        })
                      }
                    </select>
                  </div>

                </div>

                
                <div className="form-group">
                <div className="col-3 col-sm-12">
                    <label className="form-label"><h5>Event Date: </h5></label>
                </div>
                <div className="col-9 col-sm-12">
                <input className="form-input" id="input-example-14" type="date" placeholder="2019-12-31" name="eventDate" onChange={this.handleEventChange}></input>
                    
                </div>
                </div>
                
                <div className="form-group">
                <div className="col-3 col-sm-12">
                    <label className="form-label"><h5>Event Description: </h5></label>
                </div>
                <div className="col-9 col-sm-12">
                    <textarea className="form-input" id="message"
                        placeholder="Description"
                        rows="3"
                        name="eventDescription"
                        onChange={this.handleEventChange}></textarea>
                </div>
                

                </div>
                <div className="btn-group btn-group-block">
                    <button className="btn btn-primary btn-lg" type="submit">Send Event</button>
                </div>
                
            </form>         
            </div> 
            </div>
            </div>
            </div>
        </div>
                
        </div>
        </div>
        )
    }
}

export default Eventpage;