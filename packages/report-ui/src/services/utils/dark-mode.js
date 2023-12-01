import { useDark, useMediaQuery, useToggle } from "@vueuse/core";

const listeners = [];

const isDark = useDark({
  selector: "html",
  attribute: "class",
  valueDark: "dark",
  valueLight: "light",
});
const toogleDark = useToggle(isDark);

let _current = Boolean(isDark.value);

export function Toggle() {
  _current = toogleDark();
  const evt = getEvent(_current);
  useMediaQuery(`(prefers-color-scheme: ${evt.color})`);
  listeners.forEach((fn) => {
    fn.call(this, evt);
  });
  return _current;
}

export function Listen(fn) {
  listeners.push(fn);
}

export function Get() {
  return _current;
}

function getEvent(isDark) {
  const color = isDark ? "dark" : "light";
  const evt = new Event("DarkMode");
  evt.isDark = isDark;
  evt.color = color;
  return evt;
}
