import React, { useState } from 'react';
import "./App.css";
import AudioPlayer from './components/AudioPlayer';

const App = () => {
  const [selectedSong, setSelectedSong] = useState(null);

  return (
    <div className="container">
      
  <img src="./assets/logo.png" alt="Logo" className="logo" />

      {/* Pass setter to child */}
      <AudioPlayer selected={selectedSong} setSelected={setSelectedSong} />

      {selectedSong === null && (
        <footer>Copyright 2024 © iMusic</footer>
      )}
    </div>
  );
};

export default App;
