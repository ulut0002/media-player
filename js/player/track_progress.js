/**

Component Behaviour:

# User can change progress only if there is a track that's actually playing. 

# When user changes position, an event is dispatched. ('seek_position',player_key).
This event will be handled by the currently playing track. The track event will receive a percentage value, and seek proper position in the audio object 

# The moment user starts moving the range, an event is dispatched to the track. This event will make sure the track won't be sending current miliseconds of the audio object back to this component. (For UX purpose)


# Listens to 'track-is-playing' event. This event is fired by the track component every second. The component updates the remaining time, and played time in the component. 


 */

import {
  trackPositionChanged,
  enableDisableTrackTime,
} from "./player-event.js";

import { convertSecondsToHMSString } from "./util.js";

const template = document.createElement("template");
template.innerHTML = `
  <style>

    @import url("./css/style.css");


    :host {
      display: block;
    }

    .container {
      display: flex;
      gap: 0.25rem;
      align-items: center;
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

    .hide-element {
      border: 0 !important;
      clip: rect(1px 1px 1px 1px) !important; /* IE6, IE7 */
      clip: rect(1px, 1px, 1px, 1px) !important;
      height: 1px !important;
      margin: -1px !important;
      overflow: hidden !important;
      padding: 0 !important;
      position: absolute !important;
      width: 1px !important;
    }
    
    .played_time {
      flex:0;
      padding: 0 0.25rem;
    }

    .remaining_time {
      flex: 0;
      padding: 0 0.25rem;
    }

    .progress {
      flex: 1;
    }

    .text{
      color: var(--controls-color);
      font-size: var(--font-xs);
    }

  </style>

  <div id="container" class="container">
      <div id="played_time" class="text played_time" title="Played time"></div>
      <input type="range" id="progress" class="progress" name="volume" min="0" max="100" value="0" step="1" title="Progress bar">
      <div id="remaining_time" class="text remaining_time" title="Remaining time"></div>
  </div>    
`;

class TrackProgress extends HTMLElement {
  playerKey = "";
  #data = {
    currentPosition: 0,
    player_key: "",
    track_key: "",
    playing: false,
  };

  #dom = {
    range: null,
    playedTime: null,
    remainingTime: null,
  };

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "closed" });
    this.root.append(template.content.cloneNode(true));

    this.#data.playedTime = this.root.getElementById("played_time");
    this.#dom.range = this.root.getElementById("progress");
    this.#dom.remainingTime = this.root.getElementById("remaining_time");

    this.#dom.range.addEventListener(
      "change",
      this.handleRangeChange.bind(this)
    );

    this.#dom.range.addEventListener("input", this.handleRangeInput.bind(this));
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
          const oldEventType = `track-is-playing-${this.#data.player_key}`;
          // if (EventTarget.hasEventListener(oldEventType)) {
          //   document.removeEventListener(oldEventType);
          // }

          this.#data.player_key = newVal;

          //the event listener is here because this is the only place to access to the player_key.
          //connectedCallback() does not read the player_key field
          document.addEventListener(
            `track-is-playing-${this.#data.player_key}`,
            (ev) => {
              // console.log(ev.detail);
              if (this.#dom.range) {
                this.#dom.range.value = Math.floor(ev.detail.percentage);
              }
              this.#dom.remainingTime.textContent = convertSecondsToHMSString(
                ev.detail.duration - ev.detail.currentPosition
              );

              this.#data.playedTime.textContent = convertSecondsToHMSString(
                ev.detail.currentPosition
              );
            }
          );

          break;
      }
    }
  }
  disconnectedCallback() {}
  connectedCallback() {}

  // Trigger: User starts changing the input (seeking new positions every time)
  // Action: Playing track should stop sending current date-time info (Confusing UI element)
  async handleRangeInput(ev) {
    const event = enableDisableTrackTime(this.#data.player_key, true);
    if (event) {
      document.dispatchEvent(event);
    }
  }

  // Trigger: User submitting
  // Action: If no song is being played right now, prevent change. Go back to zero
  // Action: If there is a playing song,
  //    1) send an event to make track stop sending current date/time values
  //    2) send another event to force track.audio object to change time on playing track
  handleRangeChange(ev) {
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
