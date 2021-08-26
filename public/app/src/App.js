import React from 'react';
import Home from './components/Home';
import Nav from './components/Nav';
import Homepage from './components/Homepage';
import Characters from './components/Characters';
import Hamburger from 'hamburger-react';
import './styles/style.css';
import Login from './components/login';
import DropDown from './components/MenuDrop';

function App() {
  return (
    <div>
      <Home />
      <Characters />
    </div>
  );
}

export default App;
