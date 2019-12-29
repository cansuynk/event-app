import React from 'react';
import './App.css';
import Eventpage from "./Eventpage"
import Login from "./Login"
import SignUp from "./Signup"
import Axios from "axios"
import { Route, BrowserRouter as Router} from "react-router-dom";

class App extends React.Component {
    constructor(){
      super();
      this.state = { 
        auth: false,
        username: "",
        phone: "",
        email: ""
      }
      this.check_auth = this.check_auth.bind(this);
    }
    check_auth(){
        Axios.get("/auth/fetch_user").then((req) => {
          if (req.data.code === 200) {
            this.setState({
              auth: true,
              username: req.data.data.username,
              phone: req.data.data.phone_number,
              email:  req.data.data.email,
            })
          } else {
            
            this.setState({
              auth: false
            })
          }
        })
    }

    componentDidMount(){
      this.check_auth()
    }
    render() {
      return (
        <div>
          {this.state.auth ?  <Eventpage username={this.state.username} email={this.state.email} phone={this.state.phone}/> :
          <Router>
              <Route path="/login" exact component={Login} />
              <Route path="/" exact component={SignUp} />
          </Router>}
        </div>
        
      )
  }

}

export default App;
