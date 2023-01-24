import { data } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  const playerContainer = document.getElementById("player-container");
  if (playerContainer) {
    const playerEl = document.createElement("ulut0002-player");

    playerEl.tracks = JSON.stringify(data);
    playerEl.imagePath = data.imagePath;
    playerEl.mediaPath = data.mediaPath;
    playerContainer.append(playerEl);
  }
});
