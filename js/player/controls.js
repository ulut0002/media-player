import VolumeSlider from "./volume-slider.js";
import TrackProgress from "./track_progress.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
       background-color: var(--controls-background-color);

      border-top-right-radius: 0.40rem;
      border-top-left-radius: 0.40rem;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
    
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    
    .progress {
      width: 100%;
      margin-top: 0.55rem;
    }

    .control__container {
      display: flex;
      flex-direction: row;
      gap: 0.25rem;
      align-items: center;
      margin: 0.75rem 0;
    }

    .volume{
      width: min(50%, 45rem);
      // border: 5px solid green;
      margin-bottom: 0.55rem;
     
    }

        
    .player-control-icon {
      display: inline-block !important;
      font-size: var(--control-icon-size) !important;
      color: var(--controls-color) !important;
      cursor: pointer;
    }
    
    .player-control-icon:hover {
      color: var(--controls-hover-color) !important;
      transform: scale(var(--controls-hover-scale));
    }

    .hide {
      display: none !important;
    }
    

    
  
  



  </style>

  <div id="container" class="container">
    <ulut0002-progress id="progress" class="progress"></ulut0002-progress>

    <div id="control__container" class="control__container">
      <span class="material-symbols-outlined player-control-icon center" title="Previous track" id="skip_previous">
        skip_previous
      </span>

      <span class="material-symbols-outlined player-control-icon center" id="play_track">
        play_circle
      </span>

      <span class="material-symbols-outlined player-control-icon hide" id="pause_track">
        pause_circle
      </span>

      <span class="material-symbols-outlined player-control-icon" id="skip_next">
        skip_next
      </span>

      <slot name="shuffle">
        <span class="material-symbols-outlined player-control-icon" id="shuffle">shuffle</span>
        <span class="material-symbols-outlined player-control-icon hide" id="repeat">repeat</span>
        <span class="material-symbols-outlined player-control-icon hide" id="repeat_one">repeat_one</span>
      </slot>
    </div>

    <ulut0002-volume class="volume"></ulut0002-volume>
</div>


`;

class Controls extends HTMLElement {
  #data = {
    player_key: "",
  };

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });
    const clone = template.content.cloneNode(true);
    this.root.append(clone);

    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../style/player.css";
    this.root.appendChild(link);

    link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0";
    this.root.appendChild(link);

    this.#data.containerDiv = this.root.getElementById("container");
    this.#data.btnPlayTrack = this.root.getElementById("play_track");
    this.#data.btnPauseTrack = this.root.getElementById("pause_track");

    this.#data.btnShuffle = this.root.getElementById("shuffle");
    this.#data.btnRepeat = this.root.getElementById("repeat");
    this.#data.btnRepeatOne = this.root.getElementById("repeat_one");

    this.#data.progressEl = this.root.getElementById("progress");

    if (this.#data.containerDiv) {
      this.#data.containerDiv.addEventListener("click", (ev) => {
        this.handleClick.call(this, ev);
      });
    }
  }

  handleClick(ev) {
    const id = ev.target.id.toLowerCase();
    switch (id) {
      case "play_track":
        this.pauseTrack(ev);

        break;
      case "pause_track":
        this.playTrack(ev);
        break;
      case "shuffle":
        this.shuffle(ev);
        break;

      case "repeat":
        this.repeat(ev);
        break;
      case "repeat_one":
        this.repeatOne(ev);
        break;

      default:
        break;
    }
  }

  static get observedAttributes() {
    return ["player_key"];
  }

  get player_key() {
    return this.getAttribute("player_key");
  }

  set player_key(value) {
    this.#data.player_key = value;
    this.setAttribute("player_key", value);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    let rebuild = false;
    if (oldVal != newVal) {
      attrName = attrName.toLowerCase().trim();

      switch (attrName) {
        case "player_key":
          this.#data.player_key = newVal;
          if (this.#data.progressEl)
            this.#data.progressEl.player_key = this.#data.player_key;

          rebuild = true;
          break;
      }
    }
  }

  connectedCallback() {
    if (this.#data.progressEl)
      this.#data.progressEl.player_key = this.#data.player_key;
  }

  pauseTrack(ev) {
    this.#data.btnPlayTrack.classList.toggle("hide");
    this.#data.btnPauseTrack.classList.toggle("hide");
  }

  playTrack(ev) {
    this.#data.btnPlayTrack.classList.toggle("hide");
    this.#data.btnPauseTrack.classList.toggle("hide");
  }

  skipPrevious() {}

  skipNext() {}

  shuffle(ev) {
    this.#data.btnShuffle.classList.add("hide");
    this.#data.btnRepeat.classList.remove("hide");
    this.#data.btnRepeatOne.classList.add("hide");
  }

  repeat(ev) {
    this.#data.btnShuffle.classList.add("hide");
    this.#data.btnRepeat.classList.add("hide");
    this.#data.btnRepeatOne.classList.remove("hide");
  }

  repeatOne(ev) {
    this.#data.btnShuffle.classList.remove("hide");
    this.#data.btnRepeat.classList.add("hide");
    this.#data.btnRepeatOne.classList.add("hide");
  }
}

customElements.define("ulut0002-controls", Controls);
export default Controls;
