const template = document.createElement("template");

template.innerHTML = `
    <style>
    </style>
    <div id="root" class="duration">
        <slot name="value">0:00</slot>
    </div>
`;

class TrackDuration extends HTMLElement() {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "closed" });
    const clone = template.content.cloneNode(true);
    this.root.append(clone);
  }

  static get observedAttributes() {
    return ["file"];
  }
}

customElements.define("ulut0002-duration", TrackDuration);
export default TrackDuration;
