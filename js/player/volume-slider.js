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
      <span class="material-symbols-outlined player-control-icon" id="volume_off">volume_off</span>
      <span class="material-symbols-outlined player-control-icon hide" id="volume_down">volume_down</span>
      <span class="material-symbols-outlined player-control-icon hide" id="volume_up" >volume_up</span>
      <input type="range" id="volume" class="volume" name="volume" min="0" max="100" step="1" >
      <label for="volume" class="hide-element">Volume</label>
  </div>    
`;

class VolumeSlider extends HTMLElement {
  #data = {
    currentVolume: 0,
    lastVolume: 0,
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

    this.#data.volumeOffEl = this.root.getElementById("volume_off");
    this.#data.volumeDownEl = this.root.getElementById("volume_down");
    this.#data.volumeUpEl = this.root.getElementById("volume_up");
    this.#data.range = this.root.getElementById("volume");

    this.#data.volumeOffEl.addEventListener(
      "click",
      this.turnVolumeOn.bind(this)
    );

    this.#data.volumeDownEl.addEventListener(
      "click",
      this.turnVolumeOff.bind(this)
    );

    this.#data.volumeUpEl.addEventListener(
      "click",
      this.turnVolumeOff.bind(this)
    );

    this.#data.range.addEventListener(
      "input",
      this.handleRangeInput.bind(this)
    );

    this.#data.range.addEventListener(
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

  connectedCallback() {
    if (!this.#data.currentVolume) {
      this.#data.currentVolume = 0;
    }
    this.updateCurrentVolume();
  }

  turnVolumeOn(ev) {
    this.#data.currentVolume = this.#data.lastVolume;
    this.updateCurrentVolume();
    this.fireVolumeChangeEvent();
    this.displayCurrentVolume(this.#data.currentVolume);
  }

  turnVolumeOff(ev) {
    this.#data.currentVolume = 0;
    this.updateCurrentVolume();
    this.fireVolumeChangeEvent();
    this.displayCurrentVolume(this.#data.currentVolume);
  }

  updateCurrentVolume() {
    this.#data.range.value = this.#data.currentVolume;
  }

  handleRangeInput(ev) {
    // Note: The input event is fired every time the value of the element changes.
    let i = parseInt(ev.target.value);
    if (!i || isNaN(i)) i = 0;
    this.displayCurrentVolume(i);
  }

  handleRangeChange(ev) {
    // This is unlike the change event, which only fires when the value is committed, such as by pressing the enter key, selecting a value from a list of options, and the like.
    let i = parseInt(ev.target.value);
    if (!i || isNaN(i)) i = 0;
    if (i > 0) {
      //this is the last non-zero volume. so keep it in memory
      this.#data.lastVolume = i;
    }
  }

  displayCurrentVolume(i) {
    if (i === 0) {
      this.#data.volumeOffEl.classList.remove("hide");
      this.#data.volumeDownEl.classList.add("hide");
      this.#data.volumeUpEl.classList.add("hide");
    } else if (i < 50) {
      this.#data.volumeOffEl.classList.add("hide");
      this.#data.volumeDownEl.classList.remove("hide");
      this.#data.volumeUpEl.classList.add("hide");
    } else {
      this.#data.volumeOffEl.classList.add("hide");
      this.#data.volumeDownEl.classList.add("hide");
      this.#data.volumeUpEl.classList.remove("hide");
    }
  }

  fireVolumeChangeEvent() {
    //this fires a custom event to the document to adjust volume level of each audio object
    //it also fires another event so that Player object can save the current volume to local database
  }
}

customElements.define("ulut0002-volume", VolumeSlider);
export default VolumeSlider;
