import { convertSecondsToHMSString, generateRandomString } from "./util.js";
import { playEvent, trackIsPlaying } from "./player-event.js";

const template = document.createElement("template");

template.innerHTML = `
<style> 


      @import url("./css/style.css");


    :host{
        display: block;
        font-family: var(--font-family);
        color: var(--text-color);
        flex-basis: 0;
        flex-grow: 1; 
        flex: 1;
        
    }

    .track{
        background-color: var(--track-bg-color);
        cursor: pointer;
        display: grid;
        grid-template-columns: auto 1fr auto;
        grid-template-rows: minmax(min-content, max-content);
        border-bottom: var(--track-border-bottom);
    }
    
    .track:hover, .track:focus-visible{
      background-color: var(--track-hover-color);
    }

    .playing{
      background-color: var(--track-playing-item-highlight);
    }

    .image{    
      grid-column: 1 / 2;
      grid-row: 1 / 4; 
      display: flex;
      align-items: center;

    } 


    /* from: https://github.com/WICG/webcomponents/issues/795 */
    slot[name=image]::slotted(*){
      border-radius: 0.25rem;
      margin: 0.25rem;
    }
  

    .title{
      grid-column: 2 / 3;
      grid-row: 1/2;
      margin-top: 0.25rem 0;
      font-weight: bold;
      color: var(--text-color); 
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    

      overflow: hidden;
      max-width: 50ch;
      text-overflow: ellipsis;
      white-space: nowrap;


    }
    .artist{
      grid-column: 2 / 3;
      grid-row: 2 / 3;
      margin-top: 0.25rem 0;
      font-size: small;
      color: var(--text-color-light); 
      padding-left: 0.5rem;
      padding-right: 0.5rem;

      overflow: hidden;
      max-width: 50ch;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .duration{
      display: flex;
      grid-column: 3 / 4;
      grid-row: 1 / 4;
      justify-items: center;
      align-items: center;
      margin: 0.25rem;
      font-size: var(--font-xs);

      padding-right: 1rem;
    }
    
</style>

<div id="track" class="track">
    <div id="image" class="image">
      <slot name="image">Image</slot>
    </div>
    <div id="title" class="title">
      <slot name="title">Title</slot>
    </div>
    <div id="artist" class="artist">
      <slot name="artist">Artist</slot>
    </div>
    <div id="duration" class="duration">
      <slot name="duration">Duration</slot>
    </div>
</div>

`;

class Track extends HTMLElement {
  // this object keeps all track info at one place.
  // The routine can return the entire object instead of returning properties...
  // .. or returning a newly created object
  #data = {
    id: null,
    player_key: null,
    name: null,
    artist: null,
    file: null,
    image: null,
    thumbnail: null,
    audio: null,
    duration: null,
    durationText: null,
    pauseOnTimeUpdate: false,
    volume: 0,
  };

  #dom = {};

  #headerDiv;

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });
    const clone = template.content.cloneNode(true);
    this.root.append(clone);

    this.#data.id = generateRandomString(10);
    this.#headerDiv = this.root.querySelector("#track");
  }
  static get observedAttributes() {
    return ["file", "image", "thumbnail", "artist", "name", "player_key"];
  }

  set artist(value) {
    this.setAttribute("artist", value);
  }
  get artist() {
    return this.getAttribute("artist");
  }
  set name(value) {
    this.setAttribute("name", value);
  }
  get name() {
    return this.getAttribute("name");
  }
  set file(value) {
    this.setAttribute("file", value);
  }
  get file() {
    return this.getAttribute("file");
  }
  set image(value) {
    this.setAttribute("image", value);
  }
  get image() {
    return this.getAttribute("image");
  }
  set thumbnail(value) {
    this.setAttribute("thumbnail", value);
  }
  get thumbnail() {
    return this.getAttribute("thumbnail");
  }
  set player_key(value) {
    this.setAttribute("player_key", value);
  }
  get player_key() {
    return this.getAttribute("player_key");
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (oldVal != newVal) {
      attrName = attrName.toLowerCase().trim();

      switch (attrName) {
        case "file":
          this.#data.file = newVal;
          break;

        case "image":
          this.#data.image = newVal;
          break;

        case "thumbnail":
          this.#data.thumbnail = newVal;
          break;

        case "artist":
          this.#data.artist = newVal;
          break;

        case "name":
          this.#data.name = newVal;
          break;

        case "player_key":
          this.#data.player_key = newVal;
          break;
      }
    }
  }

  rebuildComponent() {}

  disconnectedCallback() {}

  handleVolumeChangeEvent(data) {
    // console.log("volume event caught ", data.volume);

    this.#data.volume = data.volume;
    if (this.#data.audio) {
      this.#data.audio.volume = data.volume / 100;
    }
  }

  // "data.position" represents a percentage
  seekPosition(data) {
    const position = data.position ? data.position : 0;
    if (this.#data.audio) {
      const duration = this.#data.audio.duration;
      const seekPos = (data.position * duration) / 100;
      this.#data.audio.currentTime = seekPos;
    }
  }

  connectedCallback() {
    document.addEventListener(`play-track-${this.#data.player_key}`, (ev) => {
      if (ev.detail.id === this.#data.id) {
        if (this.#data.audio.paused) {
          this.#data.audio.play();
          this.#headerDiv.classList.add("playing");
        } else {
          this.#data.audio.pause();
          this.#headerDiv.classList.remove("playing");
        }
      } else {
        // if the track catches this event, and it is not the current track, then it goes back to the beginning of the track

        if (this.#data.audio && !this.#data.audio.paused) {
          this.#headerDiv.classList.remove("playing");

          this.#data.audio.pause();
          this.#data.audio.currentTime = 0;
        }
      }

      document.addEventListener(`change-volume`, (ev) => {
        this.handleVolumeChangeEvent.call(this, ev.detail);
      });

      document.addEventListener(
        `pause-on-timer-update-${this.#data.player_key}`,
        (ev) => {
          this.#data.pauseOnTimeUpdate = ev.detail.enable;
        }
      );

      document.addEventListener(
        `seek-position-${this.#data.player_key}`,
        (ev) => {
          this.seekPosition.call(this, ev.detail);
        }
      );
    });

    //TODO:
    let slot;
    slot = this.root.querySelector("slot[name=title]");
    if (slot) {
      const val = slot.assignedNodes();
      if (val && val[0]) {
        this.#data.name = val[0].textContent;
      }
    }

    slot = this.root.querySelector("slot[name=artist]");
    if (slot) {
      const val = slot.assignedNodes();
      if (val && val[0]) {
        this.#data.artist = val[0].textContent;
      }
    }

    if (!this.#data.artist) {
      this.#data.artist = "unknown artist";
    }

    if (!this.#data.name) {
      this.#data.name = "unknown track";
    }

    if (this.#headerDiv) {
      // this.#headerDiv.setAttribute("track_key", this.#data.id);
      // this.#headerDiv.setAttribute("player_key", this.#data.player_key);
    }

    if (this.#data.file) {
      this.#data.audio = new Audio(this.#data.file);
      if (this.#data.audio) {
        this.#data.audio.addEventListener("loadedmetadata", () => {
          this.handleDurationRetrieval.call(this);
        });

        this.#data.audio.addEventListener("timeupdate", () => {
          // console.log("registered");
          // TODO: Enable this code later
          // this.handleOnTimeUpdate.call(this);
        });
      }
    }

    if (this.root) {
      this.#headerDiv.addEventListener("click", (ev) => {
        if (this.#data.id && this.player_key) {
          ev.stopPropagation();
          ev.preventDefault();
          this.handleTrackClick.call(this, this.#data);
        }
      });
    }
  }

  handleTrackClick(selectedTrack) {
    // if (!selectedTrack || !selectedTrack.id || !selectedTrack.player_key)
    //   return;

    // console.log("inside", selectedTrack);
    this.handlePlayButton(selectedTrack);
  }

  handlePlayButton(selectedTrack) {
    // console.log("inside handle");
    const event = playEvent(selectedTrack);
    if (event) {
      document.dispatchEvent(event);
      // console.log("event dispatached", event.detail);
    }
  }

  handlePauseButton() {
    this.pauseTrack();
  }
  handleRemoveButton() {
    this.removeTrack();
  }

  playTrack() {
    // document.dispatchEvent()
    // return;

    if (this.#data.audio) {
      if (this.#data.audio.paused) {
        const fileName = this.file;
        // console.log("file name", this.file);
        document.dispatchEvent(
          new CustomEvent("trackPlayed", {
            detail: { file: fileName },
          })
        );
        // console.log("end event dispatch");
      } else {
        this.#data.audio.currentTime = 0;
        // this.#audio.play();
      }
    }
  }
  pauseTrack() {
    // console.log("pause me");
    // return;
    if (this.#data.audio) {
      if (this.#data.audio.paused) return;
      this.#data.audio.pause();
    }
  }
  stopTrack() {}
  removeTrack() {}

  handleDurationRetrieval() {
    const formattedText = convertSecondsToHMSString(this.#data.audio.duration);
    this.#data.duration = this.#data.audio.duration;
    this.#data.durationText = formattedText;
    const el = this.root.querySelector("[name='duration']");
    if (el) el.textContent = formattedText;
  }
  handleOnTimeUpdate(data) {
    // console.log("currentTime", this.#data.audio.currentTime);
    //fire trigger for control
    if (this.#data.pauseOnTimeUpdate) return;

    const event = trackIsPlaying(
      this.#data.player_key,
      this.#data.audio.currentTime,
      this.#data.audio.duration
    );
    if (event) {
      document.dispatchEvent(event);
    }
  }
}

class TrackInfo {
  constructor() {
    this.name = undefined;
    this.artist = undefined;
    this.track = undefined;
    this.art = undefined;
    this.thumbnail = undefined;
    this.id = undefined;
    this.player_key = undefined;
    this.duration = undefined;
  }
}

customElements.define("ulut0002-track", Track);
export default Track;
