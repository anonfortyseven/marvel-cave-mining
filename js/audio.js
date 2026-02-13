/* ============================================
   Audio.js - Music & Sound Manager
   The Marvel Cave Mining Company
   ============================================ */

(function () {
  'use strict';

  var currentTrack = null;
  var currentAudio = null;
  var musicEnabled = true;
  var volume = 0.3;
  var fadeInterval = null;

  // Track mappings
  var TRACKS = {
    title: 'audio/title.mp3',
    town: 'audio/town.mp3',
    cave: 'audio/cave.mp3',
    minigame: 'audio/minigame.mp3',
    gameover: 'audio/gameover.mp3'
  };

  // Preloaded audio elements
  var audioCache = {};

  // Preload all tracks
  function preload() {
    for (var key in TRACKS) {
      var audio = new Audio();
      audio.preload = 'auto';
      audio.loop = (key !== 'gameover'); // gameover plays once
      audio.volume = 0;
      audio.src = TRACKS[key];
      audioCache[key] = audio;
    }
  }

  // Play a track with fade-in
  function play(trackName) {
    if (!musicEnabled) return;
    if (!TRACKS[trackName]) return;
    if (currentTrack === trackName && currentAudio && !currentAudio.paused) return;

    // Stop current track with fade
    if (currentAudio) {
      fadeOut(currentAudio, function () {
        startTrack(trackName);
      });
    } else {
      startTrack(trackName);
    }
  }

  function startTrack(trackName) {
    currentTrack = trackName;

    // Use cached or create new
    var audio = audioCache[trackName];
    if (!audio) {
      audio = new Audio(TRACKS[trackName]);
      audio.loop = (trackName !== 'gameover');
      audioCache[trackName] = audio;
    }

    audio.currentTime = 0;
    audio.volume = 0;
    currentAudio = audio;

    var playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(function () {
        fadeIn(audio);
      }).catch(function () {
        // Autoplay blocked - will try again on user interaction
        setupAutoplayResume(trackName);
      });
    }
  }

  // Set up listener to resume on first user interaction
  function setupAutoplayResume(trackName) {
    function resume() {
      document.removeEventListener('click', resume);
      document.removeEventListener('keydown', resume);
      document.removeEventListener('touchstart', resume);
      if (musicEnabled && currentTrack === trackName) {
        startTrack(trackName);
      }
    }
    document.addEventListener('click', resume, { once: true });
    document.addEventListener('keydown', resume, { once: true });
    document.addEventListener('touchstart', resume, { once: true });
  }

  function fadeIn(audio) {
    if (fadeInterval) clearInterval(fadeInterval);
    var target = volume;
    audio.volume = 0;
    fadeInterval = setInterval(function () {
      var v = audio.volume + 0.02;
      if (v >= target) {
        audio.volume = target;
        clearInterval(fadeInterval);
        fadeInterval = null;
      } else {
        audio.volume = v;
      }
    }, 50);
  }

  function fadeOut(audio, callback) {
    if (fadeInterval) clearInterval(fadeInterval);
    fadeInterval = setInterval(function () {
      var v = audio.volume - 0.03;
      if (v <= 0) {
        audio.volume = 0;
        audio.pause();
        clearInterval(fadeInterval);
        fadeInterval = null;
        if (callback) callback();
      } else {
        audio.volume = v;
      }
    }, 40);
  }

  // Stop all music
  function stop() {
    if (currentAudio) {
      fadeOut(currentAudio);
    }
    currentTrack = null;
  }

  // Toggle music on/off
  function toggle() {
    musicEnabled = !musicEnabled;
    if (!musicEnabled) {
      stop();
    }
    return musicEnabled;
  }

  // Set volume (0-1)
  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (currentAudio && !currentAudio.paused) {
      currentAudio.volume = volume;
    }
  }

  // Get state
  function isEnabled() {
    return musicEnabled;
  }

  function getCurrentTrack() {
    return currentTrack;
  }

  // Context-aware: play appropriate track for game state
  function playForContext(state) {
    if (!state) { play('title'); return; }

    if (state.isUnderground) {
      play('cave');
    } else {
      play('town');
    }
  }

  // Preload on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preload);
  } else {
    preload();
  }

  window.Audio_Manager = {
    play: play,
    stop: stop,
    toggle: toggle,
    setVolume: setVolume,
    isEnabled: isEnabled,
    getCurrentTrack: getCurrentTrack,
    playForContext: playForContext,
    TRACKS: TRACKS
  };

})();
