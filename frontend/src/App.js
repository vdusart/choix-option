import './App.css';
import 'bulma/css/bulma.min.css';
import { useState } from 'react';

import Header from './components/Header';
import NotLogged from './components/NotLogged';
import Logged from './components/Logged';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userState, setUserState] = useState(-1);
  const [tokenId, setTokenId] = useState(null);

  const backendUrl = process.env.NODE_ENV === "production"
    ? "https://backend-dot-choix-options.ew.r.appspot.com"
    : "http://localhost:8000";

  let changeUser = (res) => {
    if (res == null) {
      setCurrentUser(null);
      return;
    }
    setCurrentUser(res.profileObj); // Save the user data
    setTokenId(res.tokenId); // Save the tokenId
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenId: res.tokenId })
    };
    fetch(`${backendUrl}/needToImportData`, requestOptions)
      .then(async response => {
        const data = await response.json();
        setUserState(data.result);
      })
      .catch(error => {
        console.error('error:', error);
      });
  }

  return (
    <div className="App">
      <Header currentUser={currentUser} setCurrentUser={changeUser} />
      {(currentUser == null) ? <NotLogged /> : <Logged userState={userState} tokenId={tokenId} />}
    </div >
  );
}

export default App;
