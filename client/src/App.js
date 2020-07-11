import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./components/Landing";
import Register from "./components/Register";
import Login from "./components/Login";
import Account from "./components/Account";
import axios from 'axios';
import "materialize-css/dist/css/materialize.min.css";
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const res = await axios.get("/users/me");
    setUser(res.data);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <BrowserRouter>
      <Header user={user} />
      <Route exact path="/" >
        <Landing user={user} />
      </Route>
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/account" >
        <Account user={user} />
      </Route>
    </BrowserRouter>
  );
}

export default App;