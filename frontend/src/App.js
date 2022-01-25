import './App.css';
import 'bulma/css/bulma.min.css';
import { useState } from 'react';

import Header from './components/Header';
import NotLogged from './components/NotLogged';
import Logged from './components/Logged';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  let changeUser = (user) => {
    setCurrentUser(user);
  }

  return (
    <div className="App">
      <Header currentUser={currentUser} setCurrentUser={changeUser} />
      {(currentUser == null) ? <NotLogged /> : <Logged />}
    </div >
  );
}

export default App;
