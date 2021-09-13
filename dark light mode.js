"use strict"

let darkMode = true;
let root = document.querySelector(':root');

function changeMode () {
  if (darkMode) {
    darkMode = false;
    root.style.setProperty('--main-color', 'rgb(240, 240, 240)');
    root.style.setProperty('--shadow', '-1px -1px 3px rgb(255, 255, 255), 3px 3px 8px rgba(0, 0, 0, 0.1), inset 3px 3px 8px rgba(0, 0, 0, 0.03), inset -3px -3px 8px rgba(255, 255, 255, 0.3)');
    root.style.setProperty('--sub-color', 'rgba(0, 0, 0, 0.07)');
    root.style.setProperty('--string-color', 'rgb(99, 99, 99)');
    root.style.setProperty('--string-shadow', '0 0 12px rgb(99, 99, 99)');
    root.style.setProperty('--black-white', 'white');
  } else {
    darkMode = true;
    root.style.setProperty('--main-color', '#263238');
    root.style.setProperty('--shadow', '-1px -1px 3px rgba(255, 255, 255, 0.3), 3px 3px 8px rgba(0, 0, 0, 0.3), inset 3px 3px 8px rgba(0, 0, 0, 0.1), inset -3px -3px 8px rgba(255, 255, 255, 0.02)')
    root.style.setProperty('--sub-color', 'rgba(0, 0, 0, 0.3)');
    root.style.setProperty('--string-color', 'white');
    root.style.setProperty('--string-shadow', '0 0 12px white');
    root.style.setProperty('--black-white', 'black');
  }
}
