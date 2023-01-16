/**
 
 -  Player will have a playlist. 
   - add Track
   - remove Track
   - updateTrack (duration)

 - Player will perform following actions on 
   - play song
   - pause song
   - stop song
   - 
 */

import { data } from "./data.js";

class Track {
  constructor() {
    this.id = UTIL.generateRandomID();
    this.name = "";
    this.artist = "";
    this.art_cover = "";
    this.file = "";
    this.duration = 0;
    this.track_full_path = "";
    this.art_full_path = "";
  }
}

//this function is from chatGPT
function reduceVolume(audioElement, targetVolume) {
  return new Promise((resolve) => {
    const interval = 30;
    const step = (audioElement.volume - targetVolume) / (1500 / interval);
    const reduceVolumeInterval = setInterval(() => {
      if (audioElement.volume - step > targetVolume) {
        audioElement.volume -= step;
      } else {
        audioElement.volume = targetVolume;
        clearInterval(reduceVolumeInterval);
        resolve();
      }
    }, interval);
  });
}

// Usage example:
const audio = new Audio("example.mp3");
audio.volume = 0.8;
reduceVolume(audio, 0).then(() => {
  console.log("Volume reduced to 0");
});

let TrackFactory2 = function (player, track, dom) {
  this.domElements = dom;
  this.playerData = player;
  return {
    id: UTIL.generateRandomID(),
    name: track.name.trim(),
    artist: track.artist.trim(),
    name: this.name ? this.name : TrackFactory.UNKNOWN_TRACK,
    artist: this.artist ? this.artist : TrackFactory.UNKNOWN_ARTIST,
    art_cover: track.art_cover.trim(),
    file: track.file.trim(),
    art_full_path:
      this.art_cover && Player.PATHS.IMAGES
        ? Player.PATHS.IMAGES + this.art_cover
        : "",
    track_full_path:
      this.file && Player.PATHS.MEDIA ? Player.PATHS.MEDIA + this.file : "",
    addTrackToPlaylist: function (playlist) {
      // 1. adds to the playlist
      // 2. updates the duration with the callback
      if (playlist) {
      }
      if (dom) {
      }
    },
    removeTrackFromPlaylist: function (playlist) {
      // remove it from the playlist
      // update dom
    },
    play: function (currentAudio) {
      // pause currentAudio in a slowly manner
      // play current song with increasing sound

      if (currentAudio && !currentAudio.paused) {
        reduceVolume(currentAudio, 0).then(() => {
          currentAudio.pause();
        });
      }
    },
    pause: function () {
      // if (currentAudio)
    },
    stop: function () {},
  };
};

const UTIL = {
  // This function is from chatGPT
  generateRandomID: function () {
    return (
      UTIL.getRandomExt(2) +
      Date.now().toString(36) +
      UTIL.getRandomExt(3)
    ).trim();
  },

  getRandomExt: function (count = 1) {
    let result = "";
    for (let index = 0; index < count; index++) {
      result = result + Math.random().toString(36).substr(2, 5);
    }
    return result;
  },
};

// DOM contains DOM elements and the functions that update it
const UI = {
  CONST: { ATTRIBUTE: "data-player" },
  header: null,
  art: null,
  playlist: null,
  progress: null,

  init: function () {
    //load dom elements from current html document
    UI.player = UI.getElement(document, "player");
    UI.header = UI.getElement(UI.player, "header");
    UI.art = UI.getElement(UI.player, "art");
    UI.playlist = UI.getElement(UI.player, "playlist");
    UI.progress = UI.getElement(UI.player, "progress");
    if (UI.player) {
      UI.player.addEventListener("click", UI.handleFormEvent);
    }
  },

  //media player elements have a special dataset tag: "data-player="value" "
  createSelector: function (val) {
    return `[${UI.CONST.ATTRIBUTE} = ${val}]`;
  },
  //get element either from "document" object or from another element.
  getElement: function (source, val) {
    if (!source) return;
    return source.querySelector(UI.createSelector(val));
  },
  addTrackToPlaylist: function (track) {
    if (UI.playlist) {
      const html = TrackFactory.getTrackHTML(track);
      UI.playlist.insertAdjacentHTML("beforeend", html);
    }
  },
  //Event dispatcher for the player function
  handleFormEvent: function (ev) {
    // console.log("event added");
    const target = ev.target;
    // console.log(ev.target.dataset.player);
    const action = ev.target.dataset.player;
    let trackEl = undefined;
    if (action) {
      trackEl = ev.target.closest("[data-player='track-info'");
    }

    switch (action) {
      case "btn-play":
        if (trackEl && trackEl.dataset.trackid) {
          // console.log("hrere");
          Player.controller.playTrack(trackEl.dataset.trackid);
        }
        break;

      default:
        break;
    }
  },
};

const TrackFactory = {
  UNKNOWN_TRACK: "Unknown Track",
  UNKNOWN_ARTIST: "Unknown Artist",
  createTrackObject: function (trackData) {
    const track = {};
    track.id = UTIL.generateRandomID().trim();
    track.name = trackData.name.trim();
    track.artist = trackData.artist.trim();
    track.name = track.name ? track.name : TrackFactory.UNKNOWN_TRACK;
    track.artist = track.artist ? track.artist : TrackFactory.UNKNOWN_ARTIST;
    track.art_cover = trackData.art_cover.trim();
    track.file = trackData.file.trim();
    track.track_full_path = "";
    track.art_full_path = "";
    if (track.file && Player.PATHS.MEDIA)
      track.track_full_path = Player.PATHS.MEDIA + track.file;
    if (track.art_cover && Player.PATHS.IMAGES)
      track.art_full_path = Player.PATHS.IMAGES + track.art_cover;
    return track;
  },
  validateTrack: function () {
    if (!TrackFactory.duration && TrackFactory.track_full_path) {
      const path = TrackFactory.track_full_path;
      const audio = new Audio(path);
      if (audio) {
        audio.addEventListener("loadedmetadata", () => {
          //update the object
          this.duration = audio.duration;
          //find
          // TrackFactory.handleTrackDuration(
          //   TrackFactory.id,
          //   path,
          //   audio.duration
          // );
        });
      }
    }
  },

  getTrackHTML: function (track) {
    const html = `
    <div class="track__detail" data-player="track-info" data-track="${track.track_full_path}" data-art="${track.art_full_path}" data-trackid=${track.id}>
      <div class="track__art-small">
        <img src="${track.art_full_path}" alt="Something">
      </div>
      <div class="track__title" data-player="track-title">
        ${track.name}
      </div>
      <div class="track__artist" data-player="track-artist">by ${track.artist}</div>
      <div class="track__time" data-player="track-time">
        <time datetime="2000">${track.duration}</time>
        
      </div>
      <div class="track__button__container" data-player="controls">
          <span class="material-symbols-outlined btn-player btn-player-play" data-player="btn-play">play_circle</span>
          <span class="material-symbols-outlined btn-player  btn-player-pause" data-player="btn-pause">pause</span>
          <span class="material-symbols-outlined btn-player btn-player-delete" data-player="btn-delete">delete</span>
      </div>
      
    </div>`;
    return html;
  },
};

const Player = {
  PATHS: {
    MEDIA: "../media/",
    IMAGES: "../img/",
  },
  current: {
    currentSongID: "",
  },
  currentTrack: null,
  nextTrack: null,
  playerArr: [], //this will hold two tracks
  currentPlay: 0,
  controller: {
    audioController: null,
    currentController: -1,
    loadPlayer: function () {
      if (!data.tracks || !Array.isArray(data.tracks)) return;
      data.tracks.forEach((track, index) => {
        const newTrack = TrackFactory.createTrackObject(track);
        Player.playlist.addTrack(newTrack);
        // Player.ui.fn.loadTrackToPlay()
      });
    },
    getCurrentTrackIndex: function () {
      // if (Player.)
    },
    playTrack: function (id) {
      // steps:
      // stop current song if playing
      // start next song
      // console.log(`play song with id ${id}`);
      const trackToPlay = Player.playlist.data.find((track) => track.id === id);
      if (trackToPlay) {
        const audio = new Audio(trackToPlay.track_full_path);
        if (audio) {
          audio.play();
        }
      }
    },
    pauseTrack: function (id) {},
  },
  ui: {
    fn: {
      loadTrackToPlay: null,
    },
  },
  playlist: {
    playHistory: [],
    data: [],
    addTrack: function (track) {
      const html = TrackFactory.getTrackHTML(track);
      Player.playlist.data.push(track);
      if (Player.ui.fn.loadTrackToPlay) {
        Player.ui.fn.loadTrackToPlay(track);
      }
    },
    removeTrack: function (track_id) {},
  },
  init: function () {
    UI.init();
    Player.ui.fn.loadTrackToPlay = UI.addTrackToPlaylist;
    Player.controller.loadPlayer();
    // if ()
  },
};

export { Player, UI as DOM };
