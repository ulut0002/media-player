function createEvent(type, data) {
  return new CustomEvent(type, { detail: data });
}

//User clicks on play button on playlist
function playEvent(trackObj) {
  const type = `play-track-${trackObj.player_key}`;
  const data = {
    id: trackObj.id,
    image: trackObj.image,
    artist: trackObj.artist,
    name: trackObj.name,
  };
  return createEvent(type, data);
}

function volumeChanged(newVolume = 70) {
  const type = `change-volume`;
  const data = {
    volume: newVolume,
  };
  return createEvent(type, data);
}

function trackPositionChanged(player_key, newPosition) {
  const type = `seek-position-${player_key}`;
  const data = {
    position: newPosition,
  };
  return createEvent(type, data);
}

function trackIsPlaying(player_key, currentPositionInMs, totalDuration) {
  let pct = 0;
  if (!totalDuration) return null;
  if (!currentPositionInMs) currentPositionInMs = 0;
  pct = Math.floor((currentPositionInMs * 100) / totalDuration);

  const type = `track-is-playing-${player_key}`;
  const data = {
    duration: totalDuration,
    currentPosition: currentPositionInMs,
    percentage: pct,
  };
  return createEvent(type, data);
}

// This will tell current playing track to stop dispatching events
// This is because if the user starts playing with the progress bar,  we don't want to keep updating it. It is annoying
function enableDisableTrackTime(player_key, enable) {
  const type = `pause-on-timer-update-${player_key}`;
  const data = {
    enable: enable,
  };
  return createEvent(type, data);
}

export {
  playEvent,
  volumeChanged,
  trackPositionChanged,
  trackIsPlaying,
  enableDisableTrackTime,
};
