import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import {
  Home
} from './containers'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';



function App() {
  return (
    <Router>
        <Container>
          <Route path='/' exact component={Home}/>
        </Container>
    </Router>
  );
}

export default App;
