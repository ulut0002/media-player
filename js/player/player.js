import Track from "./track.js";
import Header from "./header.js";
import Preview from "./preview.js";
import Controls from "./controls.js";

import { generateRandomString } from "./util.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    .container {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows:
        minmax(min-content, max-content)
        minmax(min-content, max-content)
        1fr
        minmax(min-content, max-content);
      background-color: var(--background-color);
      
      
      color: var(--font-color);
      padding: 0;
      margin: 0;
    }

    
    .header {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
      border: none;
      padding: 0;
      margin: 0;
      background-color: var(--header-main-bg);
      background-image:  var(--header-background-gradient);
    }
    
    .preview {

      grid-column: 1 / 2;
      grid-row: 2 / 3;
      padding: 0;
      margin: 0;
    }
    
    .playlist {
      grid-column: 1 / 2;
      grid-row: 4 / 5;

      background-color: green;
    }
    
    .controls {
      grid-column: 1 / 2;
      grid-row: 3 / 4;
      background-color: blue;
    }
    
    @media only screen and (min-width: 45rem) {
      .container {
        display: grid;
        grid-template-columns: minmax(min-content, max-content) minmax(
            20rem,
            max-content
          );
    
        grid-template-columns: auto minmax(20rem, max-content);
    
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
      }
    
      .playlist {
        grid-column: 2 / 3;
        grid-row: 2 / 4;
        background-color: green;

      }
    
      .controls {
        grid-column: 1 / 2;
        grid-row: 3 / 4;
    
        background-color: blue;
      }
    }
    
      
  </style>
  
  <div id="player" class="container">
        <div id="header" class="header">
          <ulut0002-header >
            <h1 slot="title">Serdar's Mix Playlist</h1>
          </ulut0002-header>
        </div>

        <div id="preview" class="preview">
          <ulut0002-preview>
          </ulut002-preview>
        </div> 
        
        <div id="playlist" class="playlist"></div>
        <ulut0002-controls></ulut0002-controls>
    </div>

    
`;

class Player extends HTMLElement {
  #player_key = null;
  #tracks = []; //each item represents a track object.
  #imagePath = "";
  #mediaPath = "";

  #currentTrack = undefined;
  #playerDiv = undefined;
  #playlistDiv = undefined;
  #headerDiv = undefined;
  #previewDiv = undefined;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });
    const clone = template.content.cloneNode(true);
    this.root.append(clone);

    // instance id is used in event listeners.

    if (!this.player_key) {
      this.player_key = generateRandomString(10);
      console.log(this.player_key);
    }

    //some global elements..
    this.#playerDiv = this.root.getElementById("player");
    this.#playlistDiv = this.root.getElementById("playlist");
    this.#headerDiv = this.root.getElementById("header");
    this.#previewDiv = this.root
      .getElementById("preview")
      .querySelector("ulut0002-preview");
    // console.log(this.#headerDiv);
  }

  static get observedAttributes() {
    return ["tracks", "imagePath", "trackPath"];
  }

  //setters and getters
  set tracks(val) {
    this.setAttribute("tracks", val);
  }
  get tracks() {
    return this.getAttribute("tracks");
  }
  set imagePath(val) {
    this.setAttribute("imagePath", val);
  }
  get imagePath() {
    return this.getAttribute("imagePath");
  }
  set trackPath(val) {
    this.setAttribute("trackPath", val);
  }
  get trackPath() {
    return this.getAttribute("trackPath");
  }

  connectedCallback() {
    //set defaults, fix params
    if (!this.#tracks || !Array.isArray(this.#tracks)) {
      this.#tracks = [];
    }
    if (this.imagePath && this.imagePath.at(-1) !== "/") {
      this.imagePath += "/";
    }
    if (this.mediaPath && this.mediaPath.at(-1) !== "/") {
      this.mediaPath += "/";
    }

    document.addEventListener("trackPlayed", (e) => {
      console.log("track playing ", e.detail);
    });

    this.buildPlayer();
  }

  disconnectedCallback() {
    //clear memory
  }

  buildPlayer() {
    //add the unique id to the root
    //each child component (playlist, control buttons etc) will find this with closest() attribute
    //this.setAttribute("instance-id", this.#instanceID);

    //create header
    if (this.#headerDiv) {
    }

    //add tracks to the playlist
    if (this.#playlistDiv) {
      this.#tracks.forEach((track) => {
        const trackEl = document.createElement("ulut0002-track");

        let subElement = document.createElement("img");
        subElement.slot = "image";
        subElement.src = this.imagePath + track.thumbnail;
        subElement.alt = `Album art of the song ${track.name} by ${track.artist}`;
        trackEl.append(subElement);

        subElement = document.createElement("span");
        subElement.slot = "title";
        subElement.innerHTML = track.name;
        trackEl.append(subElement);

        subElement = document.createElement("span");
        subElement.slot = "artist";
        subElement.innerHTML = track.artist;
        trackEl.append(subElement);

        const path = this.#mediaPath + track.file;
        // const path1 = new URL("util.js").pathname;
        // console.log(path1);
        console.log("track path", path);
        trackEl.setAttribute("file", path);
        trackEl.setAttribute("thumbnail", this.#imagePath + track.thumbnail);
        trackEl.setAttribute("image", this.#imagePath + track.art_cover);
        trackEl.setAttribute("player_key", this.player_key);

        this.#previewDiv.setAttribute("player_key", this.player_key);

        this.#playlistDiv.append(trackEl);
      });
    }
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    attrName = attrName.toLowerCase().trim();
    if (oldVal != newVal) {
      switch (attrName) {
        case "tracks":
          try {
            const parsedData = JSON.parse(newVal);
            this.#tracks = parsedData.tracks;
            this.#imagePath = parsedData.imagePath;
            this.#mediaPath = parsedData.mediaPath;
          } catch (error) {
            //display an error
            console.log("tracks cannot be read");
          }
          break;

        default:
          break;
      }
    }
  }
}

customElements.define("ulut0002-player", Player);

export default Player;
