const template = document.createElement("template");
template.innerHTML = `
  <style>
  :host {
    background-color: var(--controls-background-color);
  }
  
  .container {
    display: grid;
    grid-template-columns: 1fr minmax(min-content, max-content);
    grid-template-rows: 1fr minmax(min-content, max-content);
    position: relative;
  }
  
  .progress_bar {
    grid-column: 1 / 3;
    grid-row: 1/ 2;
    width: 100%;
    height: var(--progress-height);
    background-color: var(--progress-background-color);
  
    position: relative;
    // border: 1px solid gray;
    overflow: hidden;
    // border-radius: 100px;
  }
  
  .background {
    background-color: goldenrod;
    background-color: var(--progress-background-color);
    width: 100%;
    height: var(--progress-height);
    left: 0;
    top: 0;
    position: absolute;
  }
  
  .ticker {
    position: absolute;
    background-color: var(--progress-color);
  
    width: 22%;
    height: var(--progress-height);
    left: 0;
    top: 0;
  }
  .control__container {
    grid-column: 1 / 2;
    grid-row: 2/ 3;
    text-align: center;
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin: 0.25rem 0;
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
  
  .timer {
    grid-column: 2 / 3;
    grid-row: 2/ 3;
    position: absolute;
    right: 1rem;
    top: 50%;
    bottom: 50%;
    font-size: var(--font-xs);
    color: var(--controls-color) !important;
    display: flex;
    justify-content: center;
    align-items: center;
    
  }
  

  
  .hide {
    display: none !important;
  }
  
  slot[name="image"]::slotted(*) {
    max-width: 100%;
    height: auto;
    width: auto;
  }

  </style>
  <div id="container" class="container">
  <div id="progress__bar" class="progress_bar">
    <div id="progress_background" class="background">&nbsp;</div>
    <div id="progress_ticker" class="ticker">&nbsp;</div>
  </div>

  <div id="play__controls__container" class="play__controls__container"></div>

  <div id="control__container" class="control__container">
    <span
      class="material-symbols-outlined player-control-icon"
      title="Previous track"
      id="skip_previous"
    >
      skip_previous
    </span>

    <span class="material-symbols-outlined player-control-icon"  id="play_track">
      play_circle
    </span>

    <span class="material-symbols-outlined player-control-icon hide"  id="pause_track">
      pause_circle
    </span>

    <span class="material-symbols-outlined player-control-icon" id="skip_next">
      skip_next
    </span>

    <slot name="shuffle">
      <span class="material-symbols-outlined player-control-icon "
      id="shuffle">shuffle</span
      >
      <span class="material-symbols-outlined player-control-icon hide"
      id="repeat">repeat</span
      >
      <span class="material-symbols-outlined player-control-icon hide"
      id="repeat_one">repeat_one</span
      >
    </slot>
  </div>

  <div id="timer" class="timer">
    <span class="current">1:12/</span>
    <span class="total">3:46</span>
  </div>
</div>

`;

class Controls extends HTMLElement {
  #data = {};
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

    if (this.#data.containerDiv) {
      this.#data.containerDiv.addEventListener("click", (ev) => {
        this.handleClick.call(this, ev);
      });
    }
  }

  handleClick(ev) {
    console.log("clicked ", ev.target.id);
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
