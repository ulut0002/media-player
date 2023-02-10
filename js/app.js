import { data } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  APP.init();
});

const APP = {
  playerContainer: null,
  PATHS: {
    IMAGE_PATH: "./img/",
    MEDIA_PATH: "./media/",
  },
  init: function () {
    APP.playerContainer = document.getElementById("player-container");
    if (APP.playerContainer) {
      const playerEl = document.createElement("ulut0002-player");

      playerEl.tracks = JSON.stringify(data);
      playerEl.imagePath = APP.PATHS.IMAGE_PATH;
      playerEl.mediaPath = APP.PATHS.MEDIA_PATH;
      APP.playerContainer.append(playerEl);
    }
  },
};
