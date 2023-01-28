import { volumeChanged } from "./player-event.js";

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
    }

    .volume{
      flex: 1;
    }
    
    .player-control-icon {
      display: inline-block !important;
      font-size: var(--control-icon-size-small) !important;
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

    .volume {
      cursor: pointer;
    }

    .hide-element {
      border: 0;
      clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
      clip: rect(1px, 1px, 1px, 1px);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }

  </style>

  <div id="container" class="container">
      <span class="material-symbols-outlined player-control-icon" id="volume_off" title="Turn volume on">volume_off</span>
      <span class="material-symbols-outlined player-control-icon hide" id="volume_down" title="turn volume off">volume_down</span>
      <span class="material-symbols-outlined player-control-icon hide" id="volume_up" title="Turn volume off">volume_up</span>
      <input type="range" id="volume" class="volume" name="volume" min="0" max="100" step="1" >
      <label for="volume" class="hide-element">Volume</label>
  </div>    
`;

class VolumeSlider extends HTMLElement {
  static DEFAULT_VOLUME = 70;
  static #VOLUME_STORAGE_KEY = `ulut0002-player-volume`;

  // component data
  #data = {
    currentVolume: 0,
    // lastVolume is used to set the volume back to original when unmute action happens
    lastVolume: 0,
  };

  // dom elements
  #dom = {};

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "closed" });
    this.root.append(template.content.cloneNode(true));

    // read dom elements
    this.#dom.volumeOffEl = this.root.getElementById("volume_off");
    this.#dom.volumeDownEl = this.root.getElementById("volume_down");
    this.#dom.volumeUpEl = this.root.getElementById("volume_up");
    this.#dom.range = this.root.getElementById("volume");

    // Trigger: Click "volume-off" icon is
    // Action:  Turn the volume on back again to the last setting (#data.lastVolume)
    // Action:  Trigger a document event to notify the other components about the volume change
    // Action:  Change the icon
    this.#dom.volumeOffEl.addEventListener(
      "click",
      this.turnVolumeOn.bind(this)
    );

    // Trigger: Click "volume-down" icon
    // Action: Turn off volume.
    // Action: Maintain #data.lastVolume
    // Action: Trigger a document event to notify the other components about the volume change
    // Action: Change the icon
    this.#dom.volumeDownEl.addEventListener(
      "click",
      this.turnVolumeOff.bind(this)
    );
    // Trigger/Action: Same as above in "volume-down" icon
    this.#dom.volumeUpEl.addEventListener(
      "click",
      this.turnVolumeOff.bind(this)
    );

    // Trigger: User starts changing the volume
    // Action: Dispatch an event so that tracks are notified about the volume change
    this.#dom.range.addEventListener("input", this.handleRangeInput.bind(this));

    // Trigger: User has changed the volume
    // Action: Dispatch an event so that tracks are notified about the volume change
    // Action: Save current setting in local storage
    this.#dom.range.addEventListener(
      "change",
      this.handleRangeChange.bind(this)
    );
  }

  // the volume can be set via:
  // 1. Application init: Read from storage
  // 2. User changed the value on the range input to the final value
  async setVolume(value) {
    value =
      isNaN(value) || value < 0 || value > 100
        ? VolumeSlider.DEFAULT_VOLUME
        : value;
    this.#data.currentVolume = value;
    this.#dom.range.value = value;
    this.#dom.range.title = value;
    await this.displayCurrentVolumeUI(this.#data.currentVolume);
    await this.fireVolumeChangeEvent();
  }

  connectedCallback() {
    this.readCurrentVolume();
  }

  async readCurrentVolume() {
    if (this.volume) {
      this.#data.currentVolume = this.volume;
    }

    if (!this.#data.currentVolume) {
      const volumeObj = localStorage.getItem(VolumeSlider.#VOLUME_STORAGE_KEY);
      if (volumeObj) {
        const volume = JSON.parse(volumeObj);
        this.#data.currentVolume = volume;
      }
    }
    // Whatever is read via local storage or attribute, save it as the last recorded volume
    if (this.#data.currentVolume) {
      this.#data.lastVolume = this.#data.currentVolume;
    }

    await this.setVolume(this.#data.currentVolume);
  }

  // Called from "mute" status. It sets the volume to the last recorded value.
  async turnVolumeOn(ev) {
    if (!this.#data.lastVolume) {
      this.#data.lastVolume = VolumeSlider.DEFAULT_VOLUME;
    }
    this.#data.currentVolume = this.#data.lastVolume;
    await this.setVolume(this.#data.currentVolume);
  }

  // Called from the sound icon. It just turns the volume off.
  async turnVolumeOff(ev) {
    this.#data.currentVolume = 0;
    await this.setVolume(this.#data.currentVolume);
  }

  // "input" event is fired every time the value of the element changes.
  // This updates the screen, dispatch events to change the volume level
  // But it does not touch the "lastVolume" variable.
  async handleRangeInput(ev) {
    let i = parseInt(ev.target.value);
    if (!i || isNaN(i)) i = 0;
    await this.setVolume(i);
  }

  // This is fired when user actually submits the new value
  // 1) Works similarly to handleRangeInput
  // 2) Update lastVolume
  // 3) Save current volume to local storage
  async handleRangeChange(ev) {
    let i = parseInt(ev.target.value);
    if (!i || isNaN(i)) i = 0;
    if (i > 0) {
      // this is the most recent value for non-zero volume.
      // It is used to set the volume back when user un-mutes volume
      this.#data.lastVolume = i;
    }
    localStorage.setItem(VolumeSlider.#VOLUME_STORAGE_KEY, JSON.stringify(i));

    await this.fireVolumeChangeEvent();
  }

  // for UI only
  async displayCurrentVolumeUI(i) {
    if (i === 0) {
      this.#dom.volumeOffEl.classList.remove("hide");
      this.#dom.volumeDownEl.classList.add("hide");
      this.#dom.volumeUpEl.classList.add("hide");
    } else if (i < 50) {
      this.#dom.volumeOffEl.classList.add("hide");
      this.#dom.volumeDownEl.classList.remove("hide");
      this.#dom.volumeUpEl.classList.add("hide");
    } else {
      this.#dom.volumeOffEl.classList.add("hide");
      this.#dom.volumeDownEl.classList.add("hide");
      this.#dom.volumeUpEl.classList.remove("hide");
    }
  }

  //Fires an "volume-changed" event. The event is caught by every track component.
  async fireVolumeChangeEvent() {
    const event = volumeChanged(this.#data.currentVolume);
    if (event) {
      document.dispatchEvent(event);
    }
  }
}

customElements.define("ulut0002-volume", VolumeSlider);
export default VolumeSlider;
