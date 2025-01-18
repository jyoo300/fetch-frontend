import { React, useState } from 'react';
import './App.css';
import EmailLogin from './components/email/EmailLogin'; // Path to the EmailLogin component
import Feed from './components/feed/Feed'; // Path to the Search component

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      {/* Conditionally render EmailLogin or Search based on loggedIn */}
      {loggedIn ? (
        <Feed />
      ) : (
        <EmailLogin setLoggedIn={setLoggedIn} />
      )}
    </div>
  );
}

export default App;
