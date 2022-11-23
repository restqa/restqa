export function LoadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.onload = resolve;
    script.onerror = reject;
    script.src = url;
    document.head.appendChild(script);
  });
}

export function LoadStyle(url) {
  return new Promise((resolve, reject) => {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.type = "text/css";
    style.onload = resolve;
    style.onerror = reject;
    style.href = url;
    document.head.appendChild(style);
  });
}
