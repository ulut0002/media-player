const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: block;
      border: var(--header-border-width) solid var(--header-border-color);
      border-radius: var(--header-border-radius);
      font-family: var(--font-family);
      color: var(--header-text-color);
      --animation-delay: 0ms;
      --scale-rate: 1.8;
    }
    
    .header {
      display: flex;
      justify-content: center;
      gap: 0.25rem;
      align-items: center;
    }
    
    slot[name="title"]::slotted(*),
    slot[name="track"]::slotted(*) {
      margin: 0;
      padding: 0;
      display: inline-block;
    }
    
    ::slotted(h1) {
      font-size: var(--font-h2);
      font-family: var(--header-font-style);
      transition: transform 1.3s;
    }
    
    /* https://github.com/WICG/webcomponents/issues/655 */
    ::slotted(h1:hover) {
      color: var(--header-text-hover-color);
      transform: scale(1.28) rotate(0deg);
      z-index: 1 !important;
    }
    
    .material-symbols-outlined {
      font-size: var(--note-size) !important;
    }
    
    .animate-up-down {
      animation: up-down-keyframe 500ms var(--animation-delay) linear infinite
          alternate forwards,
        change-color-keyframe 1000ms linear infinite alternate forwards;
    }
    
    .animate-color {
      animation: change-color-keyframe 1000ms linear alternate;
    }
    
    .delay1 {
      --animation-delay: 250ms;
    }
    
    .delay2 {
      --animation-delay: 500ms;
    }
    
    .delay3 {
      --animation-delay: 750ms;
    }
    
    .note-color-1 {
      --note-color-1: #cf5930;
      --note-color-2: #813beb;
    }
    
    .note-color-2 {
      --note-color-1: #eb3b54;
      --note-color-2: #84ea99;
    }
    
    .note-color-3 {
      --note-color-1: #5eebea;
      --note-color-2: #d14a1c;
    }
    
    .note-color-4 {
      --note-color-1: #9e3f95;
      --note-color-2: #81ebc0;
    }
    
    .note-color-5 {
      --note-color-1: #eb866e;
      --note-color-2: #3a9e7b;
    }
    
    .note-color-6 {
      --note-color-1: #ffa81e;
      --note-color-2: #fe5930;
    }
    
    @keyframes change-color-keyframe {
      0% {
        color: var(--note-color-1);
      }
      100% {
        color: var(--note-color-2);
      }
    }
    
    @keyframes up-down-keyframe {
      0% {
        transform: translateY(0);
      }
      100% {
        transform: translateY(0.5rem);
      }
    }
  

  </style>
  
  <div id="header" class="header">
    <span class="material-symbols-outlined note-color-1 animate-up-down ">music_note</span>
    <span class="material-symbols-outlined note-color-2 animate-up-down delay1">music_note</span>    
    <span class="material-symbols-outlined note-color-3 animate-up-down delay2">music_note</span>    

    <slot name="title">Title</slot>

    <span class="material-symbols-outlined note-color-5 animate-up-down ">music_note</span>
    <span class="material-symbols-outlined note-color-6 animate-up-down delay1">music_note</span>    
    <span class="material-symbols-outlined note-color-4 animate-up-down delay2">music_note</span> 
    


  </div>





`;

class Header extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });
    const clone = template.content.cloneNode(true);
    this.root.append(clone);

    let link = document.createElement("link");
    link.rel = "stylesheet";
    // link.href = "./player.css";
    link.href = "../style/player.css";

    this.root.appendChild(link);

    link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0";
    this.root.appendChild(link);

    this.headerSlot = this.root.querySelector("slot[name=title]");
    // console.log("this.headerSlot", this.headerSlot);
  }

  connectedCallback() {}
}

customElements.define("ulut0002-header", Header);
export default Header;
