import React, { useState, useEffect, useRef } from 'react';
import './Home.css';

const Home = () => {
 
  const tracks = [
    { id: 1, title: "Blinding Lights", artist: "The Weeknd", duration: "3:20", image: "https://picsum.photos/200/200?random=1" },
    { id: 2, title: "Save Your Tears", artist: "The Weeknd", duration: "3:35", image: "https://picsum.photos/200/200?random=2" },
    { id: 3, title: "Levitating", artist: "Dua Lipa", duration: "3:23", image: "https://picsum.photos/200/200?random=3" },
    { id: 4, title: "Stay", artist: "The Kid LAROI, Justin Bieber", duration: "2:59", image: "https://picsum.photos/200/200?random=4" },
    { id: 5, title: "Good 4 U", artist: "Olivia Rodrigo", duration: "2:58", image: "https://picsum.photos/200/200?random=5" },
    { id: 6, title: "Montero", artist: "Lil Nas X", duration: "2:17", image: "https://picsum.photos/200/200?random=6" },
    { id: 7, title: "Peaches", artist: "Justin Bieber", duration: "3:18", image: "https://picsum.photos/200/200?random=7" },
    { id: 8, title: "Kiss Me More", artist: "Doja Cat ft. SZA", duration: "3:28", image: "https://picsum.photos/200/200?random=8" },
    { id: 9, title: "As It Was", artist: "Harry Styles", duration: "2:47", image: "https://picsum.photos/200/200?random=9" },
    { id: 10, title: "Heat Waves", artist: "Glass Animals", duration: "3:58", image: "https://picsum.photos/200/200?random=10" },
    { id: 11, title: "Bad Guy", artist: "Billie Eilish", duration: "3:14", image: "https://picsum.photos/200/200?random=11" },
    { id: 12, title: "Watermelon Sugar", artist: "Harry Styles", duration: "2:54", image: "https://picsum.photos/200/200?random=12" },
    { id: 13, title: "Shivers", artist: "Ed Sheeran", duration: "3:27", image: "https://picsum.photos/200/200?random=13" },
    { id: 14, title: "Industry Baby", artist: "Lil Nas X, Jack Harlow", duration: "3:32", image: "https://picsum.photos/200/200?random=14" },
    { id: 15, title: "Circles", artist: "Post Malone", duration: "3:35", image: "https://picsum.photos/200/200?random=15" },
    { id: 16, title: "Dance Monkey", artist: "Tones and I", duration: "3:29", image: "https://picsum.photos/200/200?random=16" }
  ];

  const podcasts = [
    { id: 101, title: "The Daily", artist: "The New York Times", duration: "35:00", image: "https://picsum.photos/200/200?random=21" },
    { id: 102, title: "Stuff You Should Know", artist: "iHeartPodcasts", duration: "55:10", image: "https://picsum.photos/200/200?random=22" },
    { id: 103, title: "SmartLess", artist: "Wondery", duration: "62:30", image: "https://picsum.photos/200/200?random=23" },
    { id: 104, title: "Crime Junkie", artist: "audiochuck", duration: "50:15", image: "https://picsum.photos/200/200?random=24" },
    { id: 105, title: "Huberman Lab", artist: "Scicomm Media", duration: "125:00", image: "https://picsum.photos/200/200?random=25" },
    { id: 106, title: "Radiolab", artist: "WNYC Studios", duration: "58:45", image: "https://picsum.photos/200/200?random=26" },
    { id: 107, title: "Hidden Brain", artist: "NPR", duration: "49:20", image: "https://picsum.photos/200/200?random=27" }
  ];

  // State management
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [nowPlaying, setNowPlaying] = useState(tracks[0]); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [likedSongs, setLikedSongs] = useState(new Set());
  const [isShuffled, setIsShuffled] = useState(false);
  const [isQueueVisible, setIsQueueVisible] = useState(false);
  
  const trendingGridRef = useRef(null);
  const podcastsGridRef = useRef(null);
  const likedSongsRef = useRef(null);
  const searchInputRef = useRef(null);
  
  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const likedTracks = tracks.filter(track => likedSongs.has(track.id));
  
  useEffect(() => {
    setNowPlaying(tracks[currentTrackIndex]);
  }, [currentTrackIndex]);

  useEffect(() => {
    let progressInterval;
    if (isPlaying) {
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            if (tracks.some(track => track.id === nowPlaying.id)) {
              handleNext();
            }
            return 0;
          }
          const durationInSeconds = 200; 
          return prev + (100 / (durationInSeconds * 2));
        });
      }, 500);
    } else {
      clearInterval(progressInterval);
    }
    return () => clearInterval(progressInterval);
  }, [isPlaying, nowPlaying.id]);

  useEffect(() => {
    document.body.className = ''; 
    if (darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [darkMode]);

  // Handlers
  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleNext = () => setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  const handlePrev = () => setCurrentTrackIndex((prev) => (prev > 0 ? prev - 1 : tracks.length - 1));
  
  const handleTrackSelect = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setProgress(0); // Reset progress on new track selection
  };
  
  const handlePodcastSelect = (podcast) => {
    setNowPlaying(podcast);
    setIsPlaying(true);
    setProgress(0);
  };

  const toggleTheme = () => setDarkMode(!darkMode);
  const handleShuffle = () => setIsShuffled(prev => !prev);
  
  const handleHorizontalScroll = (ref, direction) => {
    const scrollAmount = 500;
    ref.current?.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };
  
  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const newProgress = (clickPosition / progressBar.offsetWidth) * 100;
    setProgress(newProgress);
  };

  const formatTime = (percentage, durationStr) => {
    if (!durationStr) return "0:00";
    const [minutes, seconds] = durationStr.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    const currentSeconds = Math.floor((percentage / 100) * totalSeconds);
    const min = Math.floor(currentSeconds / 60);
    const sec = currentSeconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleLike = () => {
    if (podcasts.some(p => p.id === nowPlaying.id)) return;

    setLikedSongs(prevLikedSongs => {
      const newLikedSongs = new Set(prevLikedSongs);
      newLikedSongs.has(nowPlaying.id) ? newLikedSongs.delete(nowPlaying.id) : newLikedSongs.add(nowPlaying.id);
      return newLikedSongs;
    });
  };

  const handleToggleLike = (trackId) => {
    setLikedSongs(prevLikedSongs => {
      const newLikedSongs = new Set(prevLikedSongs);
      if (newLikedSongs.has(trackId)) {
        newLikedSongs.delete(trackId);
      } else {
        newLikedSongs.add(trackId);
      }
      return newLikedSongs;
    });
  };
  
  const handleScrollToSection = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const handleSearchFocus = () => searchInputRef.current?.focus();
  
  const isCurrentItemLiked = likedSongs.has(nowPlaying.id);

  return (
    <div className="home-container">
      <header className="home-header">
        <a href="/" className="logo">
          <i className="fas fa-music"></i>
          <span>HarmonyStream</span>
        </a>
        <div className="search-container">
          <i className="fas fa-search"></i>
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search for songs, artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          <i className={`fas ${darkMode ? 'fa-moon' : 'fa-sun'}`}></i>
        </button>
      </header>
      
      <div className={`content-wrapper ${isQueueVisible ? 'queue-visible' : ''}`}>
        <aside className="sidebar">
          <div className="sidebar-item active"><i className="fas fa-home"></i><span>Home</span></div>
          <div className="sidebar-item" onClick={handleSearchFocus}><i className="fas fa-search"></i><span>Search</span></div>
          <div className="sidebar-item"><i className="fas fa-book"></i><span>Your Library</span></div>
          <div className="sidebar-item" onClick={() => handleScrollToSection(likedSongsRef)}><i className="fas fa-heart"></i><span>Liked Songs</span></div>
          <div className="sidebar-item" onClick={() => handleScrollToSection(podcastsGridRef)}><i className="fas fa-podcast"></i><span>Podcasts</span></div>
        </aside>

        <main className="main-content">
          <div className="trending-section">
            <h2 className="section-title">Trending Now</h2>
            <button className="scroll-btn left" aria-label="Scroll left" onClick={() => handleHorizontalScroll(trendingGridRef, 'left')}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <div ref={trendingGridRef} className="grid horizontal-scroll">
              {filteredTracks.map((track, index) => (
                <div className="card" key={track.id} onClick={() => handleTrackSelect(index)}>
                  <img src={track.image} alt={track.title} className="card-img" />
                  <div className="card-play-icon"><i className="fas fa-play"></i></div>
                  <div className="card-title">{track.title}</div>
                  <div className="card-subtitle">{track.artist}</div>
                </div>
              ))}
            </div>
            <button className="scroll-btn right" aria-label="Scroll right" onClick={() => handleHorizontalScroll(trendingGridRef, 'right')}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <div ref={podcastsGridRef} className="podcast-section">
            <h2 className="section-title">Podcasts</h2>
            <button className="scroll-btn left" aria-label="Scroll left" onClick={() => handleHorizontalScroll(podcastsGridRef, 'left')}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <div ref={podcastsGridRef} className="grid horizontal-scroll">
              {podcasts.map((podcast) => (
                <div className="card" key={podcast.id} onClick={() => handlePodcastSelect(podcast)}>
                  <img src={podcast.image} alt={podcast.title} className="card-img" />
                  <div className="card-play-icon"><i className="fas fa-play"></i></div>
                  <div className="card-title">{podcast.title}</div>
                  <div className="card-subtitle">{podcast.artist}</div>
                </div>
              ))}
            </div>
            <button className="scroll-btn right" aria-label="Scroll right" onClick={() => handleHorizontalScroll(podcastsGridRef, 'right')}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          
          {likedTracks.length > 0 && (
            <div ref={likedSongsRef} className="liked-songs-section">
              <h2 className="section-title">Liked Songs</h2>
              <div className="grid">
                {likedTracks.map((track, index) => (
                  <div className="card" key={track.id} onClick={() => handleTrackSelect(index)}>
                    <img src={track.image} alt={track.title} className="card-img" />
                    <div className="card-play-icon"><i className="fas fa-play"></i></div>
                    <div className="card-title">{track.title}</div>
                    <div className="card-subtitle">{track.artist}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
        
        {isQueueVisible && (
            <aside className="right-sidebar-queue">
              <h2 className="section-title">Now Playing Queue</h2>
              <div className="queue-list">
                  {tracks.map((track, index) => (
                    <div 
                      className={`queue-item ${index === currentTrackIndex ? 'active' : ''}`} 
                      key={track.id}
                      onClick={() => handleTrackSelect(index)}
                    >
                      <span className="queue-index">{index + 1}</span>
                      <img src={track.image} alt={track.title} className="queue-img" />
                      <div className="queue-info">
                        <div className="queue-title-artist">
                          <span className="queue-title">{track.title}</span>
                          <span className="queue-artist"> - {track.artist}</span>
                        </div>
                      </div>
                      <div className="queue-like-icon">
                        <button
                          className={`player-btn icon-btn ${likedSongs.has(track.id) ? 'active-like' : ''}`}
                          onClick={(e) => {
                              e.stopPropagation();
                              handleToggleLike(track.id);
                          }}
                        >
                          <i className={`${likedSongs.has(track.id) ? 'fas' : 'far'} fa-heart`}></i>
                        </button>
                      </div>
                      <div className="queue-duration">{track.duration}</div>
                    </div>
                  ))}
                </div>
            </aside>
        )}
      </div>

      <footer className="player">
        <div className="now-playing">
          <img src={nowPlaying.image} alt="Now Playing" className="now-playing-img" />
          <div className="now-playing-info">
            <div className="now-playing-title">{nowPlaying.title}</div>
            <div className="now-playing-artist">{nowPlaying.artist}</div>
          </div>
          {!podcasts.some(p => p.id === nowPlaying.id) && (
            <button className={`player-btn icon-btn ${isCurrentItemLiked ? 'active-like' : ''}`} onClick={handleLike} aria-label="Like song">
                <i className={`${isCurrentItemLiked ? 'fas' : 'far'} fa-heart`}></i>
            </button>
          )}
        </div>

        <div className="player-center">
          <div className="player-controls">
            <button className={`player-btn icon-btn ${isShuffled ? 'active-shuffle' : ''}`} onClick={handleShuffle} aria-label="Shuffle">
                <i className="fas fa-random"></i>
            </button>
            <button className="player-btn icon-btn" onClick={handlePrev} aria-label="Previous song"><i className="fas fa-step-backward"></i></button>
            <button className="player-btn play-btn" onClick={handlePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </button>
            <button className="player-btn icon-btn" onClick={handleNext} aria-label="Next song"><i className="fas fa-step-forward"></i></button>
            <button className="player-btn icon-btn" aria-label="Repeat"><i className="fas fa-repeat"></i></button>
          </div>
          <div className="progress-container">
            <span className="progress-time">{formatTime(progress, nowPlaying.duration)}</span>
            <div className="progress-bar" onClick={handleProgressClick}>
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="progress-time">{nowPlaying.duration}</span>
          </div>
        </div>
        
        <div className="player-right">
          <button className="player-btn icon-btn" aria-label="Queue" onClick={() => setIsQueueVisible(prev => !prev)}>
            <i className="fas fa-list-ul"></i>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Home;