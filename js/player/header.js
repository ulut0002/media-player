const template = document.createElement("template");
template.innerHTML = `
  <style>
      @import url("./css/style.css");

      :host {
        display: block;
        border: var(--header-border-width) solid var(--header-border-color);

        // border-radius: var(--header-border-radius);

        // background-color: var(--header-background-color);
      
        font-family: var(--font-family);
        // color: var(--header-text-color);
        --animation-delay: 0ms;
        --animation-start: +100%;
        --animation-end: -100%;
        --animation-time: 3s;
        --animation-scale-1: 1;
        --animation-scale-2: 1.5;
        --animation-scale-3: 1;
      
        --color-change: 1000ms;
      
        --scale-rate: 1.8;
      
        --animation-1-delay: 100ms;
        --animation-1-start: +124%;
        --animation-1-end: -135%;
      
        --animation-2-delay: 177ms;
        --animation-2-start: +129%;
        --animation-2-end: -110%;
      
        --animation-3-delay: 153ms;
        --animation-3-start: +114%;
        --animation-3-end: -125%;
      
        --animation-4-delay: 202ms;
        --animation-4-start: +144%;
        --animation-4-end: -105%;
      
        --animation-5-delay: 123ms;
        --animation-5-start: +113%;
        --animation-5-end: -133%;
      
        --animation-6-delay: 99ms;
        --animation-6-start: +123%;
        --animation-6-end: -104%;
      
        --color-1: #3F3B6C;
        --color-2: #813beb;
        --color-3: #eb3b54;
        --color-4: #404258;
        --color-5: #400E32;
        --color-6: #d14a1c;
        --color-7: #F0ECCF;
        --color-8: #03001C;
        --color-9: #eb866e;
        --color-10: #3C2317;
        --color-11: #ffa81e;
        --color-12: #FFFFE8;


        // --header-color-1: #d14a1c;
        // --header-color-2: #F0ECCF;
      }
      
      .container {
        overflow: hidden;
      }
      
      .header {

        display: flex;
        justify-content: center;
        gap: 0.25rem;
      
        align-items: center;
        margin-top: 0.5rem;
        color: var(--header-text-color);

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
        transform: scale(1.18) rotate(0deg);
        z-index: +1 !important;
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
        animation: change-color-keyframe 1000ms linear infinite alternate forwards;
      }
      
      .delay1 {
        --animation-delay: var(--animation-1-delay);
        --animation-start: var(--animation-1-start);
        --animation-end: var(--animation-1-end);
        --animation-time: 2.7s;
        --color-change: 450ms;
      }
      
      .delay2 {
        --animation-delay: var(--animation-2-delay);
        --animation-start: var(--animation-2-start);
        --animation-end: var(--animation-2-end);
        --animation-time: 2.8s;
        --color-change: 1350ms;
        --animation-scale-1: var(--animation-2-scale-1);
        --animation-scale-2: var(--animation-2-scale-2);
        --animation-scale-3: var(--animation-2-scale-3);
      }
      
      .delay3 {
        --animation-delay: var(--animation-3-delay);
        --animation-start: var(--animation-3-start);
        --animation-end: var(--animation-3-end);
        --animation-time: 3.2s;
        --color-change: 650ms;
      }
      
      .delay4 {
        --animation-delay: var(--animation-4-delay);
        --animation-start: var(--animation-4-start);
        --animation-end: var(--animation-4-end);
        --animation-time: 2.75s;
        --color-change: 789ms;
      }
      
      .delay5 {
        --animation-delay: var(--animation-5-delay);
        --animation-start: var(--animation-5-start);
        --animation-end: var(--animation-5-end);
        --animation-time: 2.88s;
        --color-change: 999ms;
      }
      
      .delay6 {
        --animation-delay: var(--animation-6-delay);
        --animation-start: var(--animation-6-start);
        --animation-end: var(--animation-6-end);
        --animation-time: 2.83s;
        --color-change: 1122ms;
      }
      
      .note-color-1 {
        --note-color-1: var(--color-1);
        --note-color-2: var(--color-2);
      }
      
      .note-color-2 {
        --note-color-1: var(--color-3);
        --note-color-2: var(--color-4);
      }
      
      .note-color-3 {
        --note-color-1: var(--color-5);
        --note-color-2: var(--color-6);
      }
      
      .note-color-4 {
        --note-color-1: var(--color-7);
        --note-color-2: var(--color-8);
      }
      
      .note-color-5 {
        --note-color-1: var(--color-9);
        --note-color-2: var(--color-10);
      }
      
      .note-color-6 {
        --note-color-1: var(--color-11);
        --note-color-2: var(--color-12);
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
      
      .slide-out-top {
        animation: slide-out-top var(--animation-time) var(--animation-delay) ease-in
            infinite,
          change-color-keyframe var(--color-change) linear infinite alternate forwards;
      }
      
      /* ----------------------------------------------
          * Generated by Animista on 2023-1-27 19:3:30
          * Licensed under FreeBSD License.
          * See http://animista.net/license for more info. 
          * w: http://animista.net, t: @cssanimista
          * ---------------------------------------------- */
      
      /**
           * ----------------------------------------
           * animation slide-out-top
           * ----------------------------------------
           */
      @keyframes slide-out-top {
        0% {
          transform: translateY(var(--animation-start));
          opacity: 0.2;
        }
        50% {
          opacity: 1;
        }
      
        100% {
          transform: translateY(var(--animation-end));
          opacity: 0.2;
        }
      }
      
      .scale-in-out {
        animation: scale-in-out 2000 ease-in infinite;
      }
      
      @keyframes scale-in-out {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(2);
        }
      
        100% {
          transform: scale(1);
        }
      }
  

 
  </style>
  
  <div class="container">
  <div id="header" class="header">
    <span class="material-symbols-outlined note-color-1 delay3 slide-out-top ">music_note</span>
    <span class="material-symbols-outlined note-color-2 delay1 slide-out-top ">music_note</span>    
    <span class="material-symbols-outlined note-color-3 delay2 slide-out-top ">music_note</span>    

    <slot name="title">Title</slot>

    <span class="material-symbols-outlined note-color-5 delay6 slide-out-top ">music_note</span>
    <span class="material-symbols-outlined note-color-6 delay4 slide-out-top ">music_note</span>    
    <span class="material-symbols-outlined note-color-4 delay5 slide-out-top ">music_note</span> 
    
  </div>
  </div>





`;

class Header extends HTMLElement {
  static COLOR_CODES = [
    "#F44336",
    "#E91E63",
    "#A75D5D",
    "#673AB7",
    "#3C2A21",
    "#FAD6A5",
    "#F99417",
    "#FAAB78",
    "#EB455F",
    "#0A2647",
    "#8BC34A",
    "#CDDC39",
    "#FFEB3B",
    "#FFC107",
    "#FF9800",
    "#FF5722",
    "#795548",
    "#850000",
    "#607D8B",
    "#DE53F5",
    "#e1341e",
    "#FF7B54",
    "#FECE44",
    "#FECE44",
    "#E8741E",
    "#D90429",
    "#F09FF5",
    "#F77760",
    "#2B3467",
    "#F72A14",
  ];

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "closed" });
    const clone = template.content.cloneNode(true);
    this.root.append(clone);

    this.headerSlot = this.root.querySelector("slot[name=title]");
  }

  connectedCallback() {
    let hostStyle = null;
    const rules = this.root.styleSheets[0].rules;
    // console.log(rules[1]["selectorText"]);
    for (const rule of rules) {
      // console.log(`Rule: `, rule);

      if (rule["selectorText"]?.toString().toLowerCase() === ":host") {
        hostStyle = rule;
        break;
      }
    }

    //Once the component is loaded, system updates [--color-1, --color-2 ... --color-12] CSS variables
    // with randomly selected colors.
    if (
      hostStyle &&
      Array.isArray(Header.COLOR_CODES) &&
      Header.COLOR_CODES.length >= 12
    ) {
      // const colorSet = new Set(Header.COLOR_CODES);
      setInterval(() => {
        for (let index = 1; index <= 12; index++) {
          const colorIndex = this.generateNumber(
            0,
            Header.COLOR_CODES.length - 1
          );
          hostStyle.style.setProperty(
            `--color-${index}`,
            Header.COLOR_CODES[colorIndex]
          );
          // hostStyle.style.setProperty(`--animation-1-scale-1`, 2);
        }

        for (let index = 1; index <= 2; index++) {
          const colorIndex = this.generateNumber(
            0,
            Header.COLOR_CODES.length - 1
          );
          hostStyle.style.setProperty(
            `--header-color-${index}`,
            Header.COLOR_CODES[colorIndex]
          );
        }
      }, 4000);
    }
  }

  generateNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // source: https://css-tricks.com/snippets/javascript/random-hex-color/
  generateRandomColor() {
    return Math.floor(Math.random() * 16777215).toString(16);
  }
}

customElements.define("ulut0002-header", Header);
export default Header;
