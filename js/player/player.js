import Track from "./track.js";
import Header from "./header.js";
import Preview from "./preview.js";
import Controls from "./controls.js";
import VolumeSlider from "./volume-slider.js";
import TrackProgress from "./track_progress.js";

import { generateRandomString } from "./util.js";
import { setCurrentTrackEvent, playEventById } from "./player-event.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>

      :host {
        display: block;
      }
      @import url("./css/style.css");


      .container {
        display: flex;
        flex-direction: column;
        background-color: var(--background-color);
        color: var(--font-color);
        padding: 0;
        margin: 0;
        min-height: 100vh;

        background: var(--preview-background);
        background-image: var(--preview-background-gradient);
      }
      
      .header {
        padding: 0;
        margin: 0;
        // background-color: var(--header-main-bg);
        //  background-image: var(--header-background-gradient);
      }
      
      .preview {
        padding: 0;
        margin: 0;
      
        display: flex;
        flex-direction: column-reverse;
      
        // background: var(--preview-background);
        // background-image: var(--preview-background-gradient);
      }
      
      .playlist {
        grid-column: 1 / 2;
        grid-row: 4 / 5;
    
        
        display: flex;
        flex-direction: column;

        // height: calc(100vh-20rem);
        height: 100%;
        width: 100%;
        background-color: var(--track-bg-color);
        overflow: auto;

      }

      .playlist-wrapper{
        // overflow: auto;
        
      }
      
      @media only screen and (min-width: 45rem) {
        .container {
          display: grid;
          grid-template-columns:
            minmax(min-content, max-content)
            minmax(20rem, max-content);
      
          grid-template-columns: auto minmax(20rem, max-content);
          grid-template-columns: 1fr auto;
      
          grid-template-rows:
            minmax(min-content, max-content)
            1fr
            minmax(min-content, max-content);

        
        }
      
        .header {
          grid-column: 1 / 3;
          grid-row: 1 / 2;
        }
      
        .preview {
          grid-column: 1 / 2;
          grid-row: 2 / 3;
          display: flex;
          flex-direction: column;
        }
      
        .playlist {
          grid-column: 2 / 3;
          grid-row: 2 / 3;
        }

        .controls {
          grid-column: 1 / 3;
          grid-row: 3/4;
        }


      }
      
    
      
  </style>
  

    <div id="player" class="container">
      <div id="header" class="header">
        <ulut0002-header>
          <h1 slot="title">Serdar's Mix Playlist</h1>
        </ulut0002-header>
      </div>

      <div id="preview" class="preview">
        <ulut0002-preview></ulut0002-preview>
      </div>

      <div id="playlist" class="playlist"></div>
      <ulut0002-controls id="controls" class="controls"></ulut0002-controls>
    </div>







    
`;

// old code
// <div id="preview" class="preview">
// <ulut0002-preview></ulut0002-preview>
//  <ulut0002-controls id=""></ulut0002-controls>
// </div>

class Player extends HTMLElement {
  #player_key = null;
  #tracksData = []; //each item represents a track object.
  #tracks = []; //an array to represent track ids.
  #currentTrackID; //represents current track id.. must be within #tracks
  #imagePath = "";
  #mediaPath = "";

  // dom elements
  #dom = {
    playerDiv: null,
    playlistDiv: null,
    headerDiv: null,
    controlDiv: null,
    previewDiv: null,
  };

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });
    const clone = template.content.cloneNode(true);
    this.root.append(clone);

    // instance id is used in event listeners.

    if (!this.player_key) {
      this.player_key = generateRandomString(10);
    }

    this.#dom.playerDiv = this.root.getElementById("player");
    this.#dom.playlistDiv = this.root.getElementById("playlist");
    this.#dom.headerDiv = this.root.getElementById("header");
    this.#dom.controlDiv = this.root.getElementById("controls");

    this.#dom.previewDiv = this.root
      .getElementById("preview")
      .querySelector("ulut0002-preview");
  }

  static get observedAttributes() {
    return ["tracks", "image", "media"];
  }

  //setters and getters
  set tracks(val) {
    this.setAttribute("tracks", val);
  }
  get tracks() {
    return this.getAttribute("tracks");
  }
  set image(val) {
    this.setAttribute("image", val);
  }
  get image() {
    return this.getAttribute("image");
  }
  set media(val) {
    this.setAttribute("media", val);
  }
  get media() {
    return this.getAttribute("media");
  }

  connectedCallback() {
    //set defaults, fix params
    if (!this.#tracksData || !Array.isArray(this.#tracksData)) {
      this.#tracksData = [];
    }
    if (this.#imagePath && this.#imagePath.at(-1) !== "/") {
      this.#imagePath += "/";
    }
    if (this.#mediaPath && this.#mediaPath.at(-1) !== "/") {
      this.#mediaPath += "/";
    }
    this.#dom.controlDiv.setAttribute("player_key", this.player_key);

    this.buildPlayer();
    this.addEventListeners();
  }

  disconnectedCallback() {
    //clear memory
  }

  buildPlayer() {
    this.#dom.previewDiv.setAttribute("player_key", this.player_key);
    let firstTrackID = "";
    //add tracks to the playlist
    if (this.#dom.playlistDiv) {
      const divEl = document.createElement("div");
      divEl.classList.add("playlist-wrapper");
      this.#dom.playlistDiv.append(divEl);

      this.#tracksData.forEach((track) => {
        const trackEl = document.createElement("ulut0002-track");

        let subElement = document.createElement("img");
        subElement.slot = "image";
        subElement.src = this.#imagePath + track.thumbnail;
        subElement.alt = `Album artwork (small) of track ${track.name} by ${track.artist}`;
        trackEl.append(subElement);

        subElement = document.createElement("span");
        subElement.slot = "title";
        subElement.title = `Track: ${track.name}`;
        subElement.innerHTML = track.name;
        trackEl.append(subElement);

        subElement = document.createElement("span");
        subElement.slot = "artist";
        subElement.title = `Artist: ${track.artist}`;
        subElement.innerHTML = track.artist;
        trackEl.append(subElement);

        const path = this.#mediaPath + track.file;
        trackEl.setAttribute("file", path);
        trackEl.setAttribute("thumbnail", this.#imagePath + track.thumbnail);
        trackEl.setAttribute("image", this.#imagePath + track.art_cover);

        trackEl.setAttribute("player_key", this.player_key);
        divEl.append(trackEl);

        if (!firstTrackID) {
          firstTrackID = trackEl.getTrackID();
        }
        this.#tracks.push(trackEl.getTrackID());
      });
    }

    if (firstTrackID) {
      //dispatch event
      const event = setCurrentTrackEvent({
        player_key: this.player_key,
        track_id: firstTrackID,
      });
      document.dispatchEvent(event);
    }
  }

  handlePlayTrackEvent(data) {
    this.#currentTrackID = data.id;
  }

  getCurrentTrackIndex() {
    if (!this.#currentTrackID) return 0;

    const idx = this.#tracks.findIndex(
      (track) => track == this.#currentTrackID
    );
    return idx;
  }

  playNextTrack() {
    let currentTrackIdx = this.getCurrentTrackIndex();
    let nextTrackIdx = currentTrackIdx + 1;
    if (nextTrackIdx >= this.#tracks.length) {
      nextTrackIdx = 0;
    }

    const nextTrack = this.#tracks.at(nextTrackIdx);
    this.firePlayTrackEvent(nextTrack);
  }

  playPreviousTrack() {
    let currentTrackIdx = this.getCurrentTrackIndex();
    let nextTrackIdx = currentTrackIdx - 1;
    if (nextTrackIdx < 0) {
      nextTrackIdx = this.#tracks.length - 1;
    }

    const nextTrack = this.#tracks.at(nextTrackIdx);
    this.firePlayTrackEvent(nextTrack);
  }

  firePlayTrackEvent(trackID) {
    if (!trackID) return;
    // console.log("here");
    const event = playEventById({
      player_key: this.player_key,
      id: trackID,
    });
    document.dispatchEvent(event);
  }

  addEventListeners() {
    document.addEventListener(`play-track-${this.player_key}`, (ev) => {
      this.handlePlayTrackEvent.call(this, ev.detail);
    });

    document.addEventListener(`play-previous-${this.player_key}`, (ev) => {
      this.playPreviousTrack.call(this);
    });

    document.addEventListener(`play-next-${this.player_key}`, (ev) => {
      this.playNextTrack.call(this);
    });
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    const attrName2 = attrName.toLowerCase().trim();
    if (oldVal != newVal) {
      switch (attrName2) {
        case "tracks":
          try {
            const parsedData = JSON.parse(newVal);
            this.#tracksData = parsedData.tracks;
          } catch (error) {
            //display an error
          }
          break;
        case "image":
          this.#imagePath = newVal;
          break;
        case "media":
          this.#mediaPath = newVal;
          break;
        default:
          break;
      }
    }
  }

  async handlePlayerEvent(ev) {}
}

customElements.define("ulut0002-player", Player);

export default Player;
