import React, { useState, useRef, useEffect } from "react";
import "./AudioPlayer.css";

export default function AudioPlayer({ selected, setSelected }) {
  const audioRef = useRef(null);

  const songs = [
    { title: "Stay", artist: "Justin Bieber", img: "/assets/stay.jpeg", src: "/audio/stay.mp3", top: true },
    { title: "Woh", artist: "Ikka", img: "/assets/woh.jpeg", src: "/audio/woh.mp3", top: false },
    { title: "Perfect", artist: "Ed Shareen", img: "/assets/perf.jpeg", src: "/audio/perf.mp3", top: false },
    { title: "Duppata", artist: "Diesby", img: "/assets/dup.jpeg", src: "/audio/dup.mp3", top: true },
    { title: "Dhundhala", artist: "Yashraj", img: "/assets/dhun.jpeg", src: "/audio/dhun.mp3", top: false },
    { title: "Señorita", artist: "Shawn Mendes", img: "/assets/sen.jpeg", src: "/audio/sen.mp3", top: true },
    { title: "Thodi Si Daaru", artist: "AP Dhillon", img: "/assets/si.jpeg", src: "/audio/si.mp3", top: true },
    { title: "LET THE WORLD BURN", artist: "Chris Grey", img: "/assets/ltwb.jpeg", src: "/audio/ltwb.mp3", top: false }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [search, setSearch] = useState("");

  const openPlayer = (idx) => {
    setCurrentIndex(idx);
    setSelected(idx);
    setIsPlaying(true);
  };

  // ✅ Load new song only when index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = songs[currentIndex].src;
    audio.load();

    const onLoaded = () => {
      setDuration(audio.duration || 0);
      if (isPlaying) audio.play().catch(() => {});
    };

    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => playNext();

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentIndex]); // ❌ Removed isPlaying

  // ✅ Handle play/pause without resetting
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    isPlaying ? audio.play().catch(() => {}) : audio.pause();
  }, [isPlaying]);

  const playNext = () => {
    setCurrentTime(0);
    setCurrentIndex((i) => (i + 1) % songs.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTime(0);
    setCurrentIndex((i) => (i === 0 ? songs.length - 1 : i - 1));
    setIsPlaying(true);
  };

  const handleSeek = (e) => {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setCurrentTime(val);
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const filteredSongs = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artist.toLowerCase().includes(search.toLowerCase())
  );

  const topPicks = songs.filter((s) => s.top === true);

  if (selected === null) {
    return (
      <div className="song-list-container">
        <h2 className="list-heading">Top Picks</h2>
        <div className="song-list">
          {topPicks.map((s, idx) => (
            <div key={idx} className="song-item" onClick={() => openPlayer(songs.indexOf(s))}>
              <img src={s.img} alt={s.title} className="song-thumb" />
              <div className="song-meta">
                <p className="song-name">{s.title}</p>
                <p className="song-artist">{s.artist}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="list-heading" style={{ marginTop: "25px" }}>All Songs</h2>

        <input
          type="text"
          placeholder="Search music..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="song-list">
          {filteredSongs.map((s, idx) => (
            <div key={idx} className="song-item" onClick={() => openPlayer(idx)}>
              <img src={s.img} alt={s.title} className="song-thumb" />
              <div className="song-meta">
                <p className="song-name">{s.title}</p>
                <p className="song-artist">{s.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentSong = songs[currentIndex];

  return (
    <div className="player-card">
      <button className="back-btn" onClick={() => setSelected(null)}>← Back</button>

      <img src={currentSong.img} alt="cover" className="cover-art" />

      <h2 className="song-title">{currentSong.title}</h2>
      <p className="song-artist">{currentSong.artist}</p>

      <audio ref={audioRef} />

      <input
        className="seek"
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={handleSeek}
        step="0.01"
        style={{
          background: `linear-gradient(to right,
            black ${(currentTime / duration) * 100}%,
            white ${(currentTime / duration) * 100}%
          )`
        }}
      />

      <div className="track-duration">
        <p>{formatTime(currentTime)}</p>
        <p>{formatTime(duration)}</p>
      </div>

      <div className="controls">
        <button className="control-btn" onClick={playPrev}>⏮</button>
        <button className="play-btn" onClick={() => setIsPlaying((p) => !p)}>
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button className="control-btn" onClick={playNext}>⏭</button>
      </div>
    </div>
  );
}
