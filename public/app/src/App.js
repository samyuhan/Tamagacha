import React from 'react';
import Home from './components/Home';
import Nav from './components/Nav';
import Homepage from './components/Homepage';
import Characters from './components/Characters';
import Hamburger from 'hamburger-react';
import './styles/style.css';
import Login from './components/login';
import DropDown from './components/MenuDrop';
import Ttt from './components/Ttt';

function App() {
  return (
    <div>
      <Home />
      <Homepage />
      <Ttt />
    </div>
  );
}

export default App;
