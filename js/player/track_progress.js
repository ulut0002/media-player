/**
 *
 * Triggers:
 * range.change event: fire an event ('seek_position',player_key) -> this will affect the current song only
 *
 */
import {
  trackPositionChanged,
  enableDisableTrackTime,
} from "./player-event.js";

const template = document.createElement("template");
template.innerHTML = `


<style>

:host{
  display: block;
}

.container{
  display: flex;
  gap: 0.25rem;
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

.hide{
  display: none !important;
}

.volume{
  cursor: pointer;
}


.hide-element {
  border: 0;
  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
  clip; rect(1px, 1px, 1px, 1px);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px; 
} 

</style>

  <div id="container" class="container">
      <div id="played_time" class="played_time"></div>
      <input type="range" id="progress" class="progress" name="volume" min="0" max="100" step="1" >
      <div id="remaining_time" class="remaining_time"></div>
  </div>    
`;

class TrackProgress extends HTMLElement {
  playerKey = "";
  #data = {
    currentPosition: 0,
    player_key: "",
    range: null,
    playedTime: null,
    remainingTime: null,
  };

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "closed" });
    this.root.append(template.content.cloneNode(true));

    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../style/player.css";
    this.root.appendChild(link);

    link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0";
    this.root.appendChild(link);

    this.#data.playedTime = this.root.getElementById("played_time");
    this.#data.range = this.root.getElementById("progress");
    this.#data.remainingTime = this.root.getElementById("remaining_time");

    this.#data.range.addEventListener(
      "change",
      this.handleRangeChange.bind(this)
    );

    this.#data.range.addEventListener(
      "input",
      this.handleRangeInput.bind(this)
    );
  }

  static get observedAttributes() {
    return ["player_key"];
  }

  get player_key() {
    return this.getAttribute("player_key");
  }

  set player_key(value) {
    this.setAttribute("player_key", value);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (oldVal != newVal) {
      attrName = attrName.toLowerCase().trim();

      switch (attrName) {
        case "player_key":
          console.log("boom!", newVal);
          this.#data.player_key = newVal;
          // console.log("xx", this.#data.player_key);

          document.addEventListener(
            `track-is-playing-${this.#data.player_key}`,
            (ev) => {
              console.log(ev);
              if (this.#data.range && ev.detail.percentage) {
                this.#data.range.value = ev.detail.percentage;
              }
              this.#data.remainingTime.textContent =
                ev.detail.duration - ev.detail.currentPosition;
              this.#data.playedTime.textContent = ev.detail.currentPosition;
            }
          );

          break;
      }
    }
  }
  disconnectedCallback() {}
  connectedCallback() {
    // console.log("progress", this.#data.player_key);
  }

  handleRangeInput(ev) {
    const event = enableDisableTrackTime(this.#data.player_key, true);
    if (event) {
      document.dispatchEvent(event);
    }
  }

  handleRangeChange(ev) {
    // This is unlike the change event, which only fires when the value is committed, such as by pressing the enter key, selecting a value from a list of options, and the like.
    let i = parseInt(ev.target.value);
    if (!i || isNaN(i)) i = 0;
    // console.log("track is ", i);
    this.#data.currentPosition = i;
    this.firePositionChangeEvent();

    const event = enableDisableTrackTime(this.#data.player_key, false);
    if (event) {
      document.dispatchEvent(event);
    }
  }

  firePositionChangeEvent() {
    const event = trackPositionChanged(
      this.#data.player_key,
      this.#data.currentPosition
    );
    if (event) {
      document.dispatchEvent(event);
    }
  }
}

customElements.define("ulut0002-progress", TrackProgress);
export default TrackProgress;
