const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host{
 
    }


    .container{
        display: grid;
        grid-template-columns: 1fr minmax(min-content, max-content);
        grid-template-rows: 1fr minmax(min-content, max-content);
        position: relative;

    }

    .progress_bar{
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

    .background{
      background-color: goldenrod;
      background-color: #aca1b0;
       width: 100%;
       height: var(--progress-height);
       left: 0;
       top:0;
       position: absolute;
      //  border-radius: 100px;

    }

    .ticker{
      position: absolute;
      background-color: var(--progress-background-color);

      background-color: #393556;
      width: 22%;
      height: var(--progress-height);
      left: 0;
      top: 0;
      // border-radius: 100px;

   }
    .control__container{
        grid-column: 1 / 2;
        grid-row: 2/ 3;
        text-align: center;

        display: flex;
        gap: 1rem;
        justify-content: center;
    }

    .player-control-icon{
        display: inline-block !important;
        font-size: var(--control-icon-size) !important;
        color: var(--primary-color-dark) !important;     
        cursor: pointer;
    }

  
    .player-control-icon:hover{
      color: var(--primary-color) !important;     
      transform: scale(1.15);
    }


    .timer{
        grid-column: 2 / 3;
        grid-row: 2/ 3;
        position: absolute;
        right: 1rem;
        font-size: var(--font-xs);
    }


    
    slot[name=image]::slotted(*){
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


    <div id="play__controls__container" class="play__controls__container">
      
    </div>

    <div id="control__container" class="control__container">
        <span class="material-symbols-outlined player-control-icon" title="Previous track">
        skip_previous
        </span>

 
            <span class="material-symbols-outlined player-control-icon">
            play_circle
            </span>

            <span class="material-symbols-outlined player-control-icon">
            pause_circle
            </span>

        <span class="material-symbols-outlined player-control-icon">
        skip_next
        </span>

      

        <slot name="shuffle">
          <span class="material-symbols-outlined player-control-icon">shuffle</span>
          <span class="material-symbols-outlined player-control-icon">repeat</span>
          <span class="material-symbols-outlined player-control-icon">repeat_one</span>
        </slot>
        


   
    </div>

    <div id="timer" class="timer">
      <span class="current">Current</span>
      <span class="total">Total</span>
    </div>
    
  
  </div>

`;

class Controls extends HTMLElement {
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
  }
}

customElements.define("ulut0002-controls", Controls);
export default Controls;
