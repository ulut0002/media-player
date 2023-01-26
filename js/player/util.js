function convertSecondsToHMS(seconds) {
  seconds = Math.floor(seconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return { hours, minutes, secs };
}

function getLastTwo(val) {
  let value = val;
  value = "0000" + value.toString();
  return value.substring(value.length - 2, value.length);
}

//source: chatGPT
export function generateRandomString(length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export function convertSecondsToHMSString(seconds) {
  const val = convertSecondsToHMS(seconds);
  const valStr = { hours: "", minutes: "", secs: "" };

  valStr.secs = getLastTwo(val.secs);

  if (val.minutes) {
    valStr.minutes = getLastTwo(val.minutes);
  }

  if (val.hours) {
    valStr.hours = getLastTwo(val.hours);
    if (!val.minutes) valStr.minutes = "00";
  }

  if (val.hours) {
    return `${valStr.hours}:${valStr.minutes}:${valStr.secs}`;
  }
  if (val.minutes) {
    return `${valStr.minutes}:${valStr.secs}`;
  }
  return `00:${valStr.secs}`;
}
