const template = document.createElement("template");
template.innerHTML = `
  <style>

    @import url("./style/player.css");

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
      <span class="material-symbols-outlined player-control-icon" id="volume_off">volume_off</span>
      <span class="material-symbols-outlined player-control-icon hide" id="volume_down">volume_down</span>
      <span class="material-symbols-outlined player-control-icon hide" id="volume_up" >volume_up</span>
      <input type="range" id="volume" class="volume" name="volume" min="0" max="100" step="1" >
      <label for="volume" class="hide-element">Volume</label>
  </div>    
`;

class VolumeSlider extends HTMLElement {
  static DEFAULT_VOLUME = 70;
  static #VOLUME_STORAGE_KEY = `ulut0002-player-volume`;

  //stores component data
  #data = {
    currentVolume: 0,
    lastVolume: 0, // Used to set the volume back to original when unmute action happens
  };

  //stores dom elements
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

    /*
    //Disabled for usability. Each window can have its own sound setting
    window.addEventListener("storage", (ev) =>
      this.handleStorageChange.call(this, ev)
    );
    */

    // Click "volume-off" icon is clicked ->  system turns the volume on (knowing it was already muted)
    this.#dom.volumeOffEl.addEventListener(
      "click",
      this.turnVolumeOn.bind(this)
    );

    // When "volume-down" is clicked, sound is turned off
    this.#dom.volumeDownEl.addEventListener(
      "click",
      this.turnVolumeOff.bind(this)
    );

    // When "volume-up" is clicked, sound is turned off
    this.#dom.volumeUpEl.addEventListener(
      "click",
      this.turnVolumeOff.bind(this)
    );

    // When user starts changing range values, an event is sent to the playing track to change the volume
    this.#dom.range.addEventListener("input", this.handleRangeInput.bind(this));

    // When user submits the volume setting:
    // 1: an event is sent to the playing track to change the volume
    // 2: The setting is saved in local storage
    this.#dom.range.addEventListener(
      "change",
      this.handleRangeChange.bind(this)
    );
  }

  static get observedAttributes() {
    return ["volume"];
  }

  get volume() {
    return this.getAttribute("volume");
  }

  set volume(value) {
    this.setAttribute("volume", value);
  }

  async handleStorageChange(ev) {
    return;
    if (!ev && !ev.key) return;
    switch (ev.key) {
      case VolumeSlider.#VOLUME_STORAGE_KEY:
        let newValue = parseInt(JSON.parse(ev.newValue));
        //No need for this. Each window can have its own volume
        //await this.setVolume(newValue);

        break;
    }
  }

  async setVolume(value) {
    value =
      isNaN(value) || value < 0 || value > 100
        ? VolumeSlider.DEFAULT_VOLUME
        : value;
    this.#data.currentVolume = value;
    this.#dom.range.value = value;
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

    const volumeObj = localStorage.getItem(VolumeSlider.#VOLUME_STORAGE_KEY);
    if (volumeObj) {
      const volume = JSON.parse(volumeObj);
      this.#data.currentVolume = volume;
    }
    await this.setVolume(this.#data.currentVolume);
  }

  async turnVolumeOn(ev) {
    this.#data.currentVolume = this.#data.lastVolume;
    await this.setVolume(this.#data.currentVolume);
  }

  async turnVolumeOff(ev) {
    this.#data.currentVolume = 0;
    await this.setVolume(this.#data.currentVolume);
  }

  // "input" event is fired every time the value of the element changes.
  async handleRangeInput(ev) {
    let i = parseInt(ev.target.value);
    if (!i || isNaN(i)) i = 0;
    await this.displayCurrentVolumeUI(i);
  }

  // This is fired when user actually submits the new value
  async handleRangeChange(ev) {
    let i = parseInt(ev.target.value);
    if (!i || isNaN(i)) i = 0;
    if (i > 0) {
      // this is the most recent value for non-zero volume.
      // It is used to set the volume back when user unmutes
      this.#data.lastVolume = i;
    }
    localStorage.setItem(VolumeSlider.#VOLUME_STORAGE_KEY, JSON.stringify(i));
    await this.fireVolumeChangeEvent();
  }

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

  async fireVolumeChangeEvent() {
    //TODO: Dispatch a windows event so that tracks can be notified about the volume change.
  }
}

customElements.define("ulut0002-volume", VolumeSlider);
export default VolumeSlider;
