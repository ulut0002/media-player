const PLAYER = {};

const audio = new Audio("../media/dengue_fever_seeing_hands.mp3");

console.log(audio);

audio.addEventListener("loadeddata", () => {
  console.log(audio.duration);
});
