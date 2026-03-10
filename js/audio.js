/* ============================================
   Audio.js - Music & Sound Manager
   The Marvel Cave Mining Company
   ============================================ */

(function () {
  'use strict';

  var currentTrack = null;
  var currentAudio = null;
  var musicEnabled = true;
  var volume = 0.5;
  var fadeInterval = null;
  var userHasInteracted = false;
  var pendingTrack = null;
  var DEFAULT_FADE_IN_MS = 900;
  var DEFAULT_FADE_OUT_MS = 500;

  // Track mappings
  var TRACKS = {
    title: 'audio/title.mp3',
    town: 'audio/town.mp3',
    cave: 'audio/cave.mp3',
    minigame: 'audio/minigame.mp3',
    gameover: 'audio/gameover.mp3'
  };

  var audioCache = {};

  function preload() {
    for (var key in TRACKS) {
      var audio = new Audio();
      audio.preload = 'auto';
      audio.loop = (key !== 'gameover');
      audio.volume = 0;
      audio.src = TRACKS[key];
      audioCache[key] = audio;
    }
  }

  // Global interaction listener - keeps trying until music plays
  function onUserInteraction() {
    userHasInteracted = true;
    if (pendingTrack && musicEnabled) {
      startTrack(pendingTrack);
      pendingTrack = null;
    }
  }

  function setupGlobalListeners() {
    var events = ['click', 'keydown', 'touchstart', 'pointerdown'];
    for (var i = 0; i < events.length; i++) {
      document.addEventListener(events[i], onUserInteraction, { capture: true });
    }
  }

  function removeGlobalListeners() {
    var events = ['click', 'keydown', 'touchstart', 'pointerdown'];
    for (var i = 0; i < events.length; i++) {
      document.removeEventListener(events[i], onUserInteraction, { capture: true });
    }
  }

  function play(trackName) {
    if (!musicEnabled) return;
    if (!TRACKS[trackName]) return;
    if (currentTrack === trackName && currentAudio && !currentAudio.paused) return;

    if (!userHasInteracted) {
      // Can't play yet - save for when user interacts
      pendingTrack = trackName;
      currentTrack = trackName;
      return;
    }

    if (currentAudio && !currentAudio.paused) {
      fadeOut(currentAudio, function () {
        startTrack(trackName);
      }, DEFAULT_FADE_OUT_MS);
    } else {
      startTrack(trackName);
    }
  }

  function startTrack(trackName) {
    currentTrack = trackName;

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
        // Success - music is playing
        userHasInteracted = true;
        pendingTrack = null;
        removeGlobalListeners();
        fadeIn(audio, DEFAULT_FADE_IN_MS);
      }).catch(function () {
        // Still blocked - keep pending
        pendingTrack = trackName;
        userHasInteracted = false;
        setupGlobalListeners();
      });
    } else {
      // Old browser, no promise - assume it worked
      fadeIn(audio, DEFAULT_FADE_IN_MS);
    }
  }

  function clearFade() {
    if (fadeInterval) clearInterval(fadeInterval);
    fadeInterval = null;
  }

  function animateVolume(audio, toVolume, durationMs, callback) {
    if (!audio) {
      if (callback) callback();
      return;
    }
    clearFade();
    var start = audio.volume;
    var target = Math.max(0, Math.min(1, toVolume));
    var duration = Math.max(80, durationMs || DEFAULT_FADE_OUT_MS);
    var stepMs = 40;
    var steps = Math.max(1, Math.round(duration / stepMs));
    var delta = (target - start) / steps;

    fadeInterval = setInterval(function () {
      var next = audio.volume + delta;
      var done = delta >= 0 ? next >= target : next <= target;
      if (done) {
        audio.volume = target;
        clearFade();
        if (callback) callback();
      } else {
        audio.volume = Math.max(0, Math.min(1, next));
      }
    }, stepMs);
  }

  function fadeIn(audio, durationMs) {
    animateVolume(audio, volume, durationMs || DEFAULT_FADE_IN_MS);
  }

  function fadeOut(audio, callback, durationMs) {
    animateVolume(audio, 0, durationMs || DEFAULT_FADE_OUT_MS, function () {
      audio.pause();
      if (audio === currentAudio) {
        currentAudio = null;
      }
      if (callback) callback();
    });
  }

  function stop(durationMs, callback) {
    pendingTrack = null;
    currentTrack = null;
    if (currentAudio && !currentAudio.paused) {
      fadeOut(currentAudio, callback, durationMs || DEFAULT_FADE_OUT_MS);
    } else if (currentAudio) {
      currentAudio.pause();
      currentAudio.volume = 0;
      currentAudio = null;
      if (callback) callback();
    } else if (callback) {
      callback();
    }
  }

  function toggle() {
    musicEnabled = !musicEnabled;
    if (!musicEnabled) {
      stop();
    } else if (currentTrack) {
      play(currentTrack);
    }
    return musicEnabled;
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (currentAudio && !currentAudio.paused) {
      currentAudio.volume = volume;
    }
  }

  function isEnabled() {
    return musicEnabled;
  }

  function getCurrentTrack() {
    return currentTrack;
  }

  function playForContext(state) {
    if (!state) { play('title'); return; }
    if (state.isUnderground) {
      play('cave');
    } else {
      play('town');
    }
  }

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      preload();
      setupGlobalListeners();
    });
  } else {
    preload();
    setupGlobalListeners();
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
