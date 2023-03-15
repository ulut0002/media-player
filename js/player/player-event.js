function createEvent(type, data) {
  return new CustomEvent(type, { detail: data });
}

// This is a generic event for all events
// It can be fired by all components, but it is handled by Player.js
function playerEvent(obj) {
  const type = `player-event-${obj.player_key}`;
  const data = {
    eventSource: obj.eventSource,
    eventTrigger: obj.eventTrigger,
    eventAction: obj.action,
    trackId: trackId,
    playerKey: playerKey,
    otherData: obj.otherData,
  };
  return createEvent(type, data);
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

//User clicks on play button on playlist
function playEventById(trackObj) {
  const type = `play-track-by-id-${trackObj.player_key}`;
  const data = {
    id: trackObj.id,
  };
  return createEvent(type, data);
}

function playNext(obj) {
  const type = `play-next-${obj.player_key}`;
  const data = {};
  return createEvent(type, data);
}

function playPrevious(obj) {
  const type = `play-previous-${obj.player_key}`;
  const data = {};
  return createEvent(type, data);
}

//User clicks on play button on playlist
function previewEvent(trackObj) {
  const type = `preview-track-${trackObj.player_key}`;
  const data = {
    id: trackObj.id,
    image: trackObj.image,
    artist: trackObj.artist,
    name: trackObj.name,
  };
  return createEvent(type, data);
}

//from controls
function controlTrackEvent(obj) {
  const type = `control-track-event-${obj.player_key}`;
  const data = {
    player_key: obj.player_key,
    track_id: obj.track_id,
    action: obj.action,
  };
  return createEvent(type, data);
}

function setCurrentTrackEvent(obj) {
  const type = `set-current-track-${obj.player_key}`;
  const data = {
    track_id: obj.track_id,
  };
  return createEvent(type, data);
}

function currentMediaChangeEvent(player_key, currentlyPlaying) {
  const type = `track-play-status-${player_key}`;
  const data = {
    playing: currentlyPlaying,
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

function trackIsPlaying(
  player_key,
  currentPositionInMs,
  totalDuration,
  track_key
) {
  if (!totalDuration) return null;
  if (!currentPositionInMs) currentPositionInMs = 0;
  const ratio = currentPositionInMs / totalDuration;
  const pct = Math.floor(ratio * 100);

  const type = `track-is-playing-${player_key}`;
  const data = {
    duration: totalDuration,
    currentPosition: currentPositionInMs,
    percentage: pct,
    ratio: ratio,
    track_key: track_key,
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
  playerEvent,
  playEvent,
  controlTrackEvent,
  volumeChanged,
  trackPositionChanged,
  trackIsPlaying,
  enableDisableTrackTime,
  currentMediaChangeEvent,
  setCurrentTrackEvent,
  previewEvent,
  playNext,
  playPrevious,
  playEventById,
};
