import React from 'react';
import './App.css';
import Eventpage from "./Eventpage"
import Login from "./Login"
import SignUp from "./Signup"
import { Route, BrowserRouter as Router} from "react-router-dom";

class App extends React.Component {
 
    render() {
      return (
        <Router>
            <Route path="/login" exact component={Login} />
            <Route path="/eventpage" exact component={Eventpage} />
            <Route path="/" exact component={SignUp} />
        </Router>
      )
  }

}

export default App;
