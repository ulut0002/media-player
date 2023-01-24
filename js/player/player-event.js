function playEvent(trackObj) {
  const type = `play-track-${trackObj.player_key}`;
  const data = {
    id: trackObj.id,
    image: trackObj.image,
    artist: trackObj.artist,
    name: trackObj.name,
  };

  const event = new CustomEvent(type, {
    detail: data,
  });
  return event;
}

export { playEvent };
