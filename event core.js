"use strict"

let workSpace = document.getElementById('work-space');
let svgSpace = document.getElementById('svg-space');
let scale = 1;
let mouseDown = false;
let mouseX;
let mouseY;
let pageX;
let pageY;

let activeLinks = [];
let blurSpace = document.getElementById('blur-space');

let focusVertex = false;
let focusLink = false;
let focusColor;
let decVertex;


input.addEventListener('paste', (e) => {
  setTimeout(() => {
    input.firstChild.style.color = 'var(--string-color)';
  }, 20);
})


workSpace.onmousedown = (e) => {
  mouseDown = true;
  if (!moveBlock) {
    mouseX = e.x;
    mouseY = e.y;
    pageX = window.pageXOffset;
    pageY = window.pageYOffset;
  }
}

let moveBlock = false
workSpace.onmousemove = (e) => {
  if (moveBlock) {
    // console.log(e.pageX)
    // console.log(e.x)
    moveBlock.style.left = e.pageX+10+'px';
    moveBlock.style.top = e.pageY+10+'px';
    doDynamicAllLinks();
  }
  if (mouseDown) {
    if (!mainParent && !moveBlock) {
      window.scroll(pageX + (mouseX - e.x), pageY + (mouseY - e.y))
    }
    if (mainParent && !moveBlock) {
      moveBlock = mainParent;
      moveBlock.style.transition = 'none';
    }
  }
}


workSpace.onmouseup = (e) => {
  mouseDown = false;
  moveBlock.style.transition = '0.3s';
  moveBlock = false;
}


// =================================================================
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

function doZoomWorkSpace (key) {
  if (key == 90) {
    scale -= 0.1;
    workSpace.style.zoom = scale;
    svgSpace.style.zoom = scale;
  } else {
    scale += 0.1;
    workSpace.style.zoom = scale;
    svgSpace.style.zoom = scale;
  }
}


document.addEventListener('keydown', (e) => {
  if (e.keyCode == 90 || e.keyCode == 88) {
    doZoomWorkSpace(e.keyCode);
  }
})


// =================================================================
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||


function doZoomPlusByHidden () {
  mainParent.querySelectorAll('.hide').forEach((block) => {
    block.style.display = 'inline';
    animateZoom.mainFunc(block, 0.1, 1, 0.1, true);
  })
}


function doZoomMinusByHidden () {
  mainParent.querySelectorAll('.hide').forEach((block) => {
    animateZoom.mainFunc(block, 1, 0.1, -0.1);
    block.style.display = 'none';
  })
}


var animateZoom = {
  mainFunc: function(block, startSize, finishSize, stepSize, zoomPlus = false) {
    startSize = animateZoom.update(block, startSize, stepSize);
    if (zoomPlus) {
      if (startSize < finishSize) {
        requestAnimationFrame(function() {
          animateZoom.mainFunc(block, startSize, finishSize, stepSize, zoomPlus);
        })
      } else {
        block.style.zoom = finishSize;
      }
    } else {
      if (startSize > finishSize) {
        requestAnimationFrame(function() {
          animateZoom.mainFunc(block, startSize, finishSize, stepSize, zoomPlus);
        })
      } else {
        block.style.zoom = finishSize;
      }
    }
  },
  update: function(block, startSize, stepSize) {
    let result = Number((startSize + stepSize).toFixed(2));
    block.style.zoom = result;
    return result
  }
}


function getZoomSubBlock () {
  workSpace.querySelectorAll('.sub-block').forEach((sub) => {
    sub.onmouseenter = (e) => {
      animateZoom.mainFunc(sub, 0.5, 1, 0.05, true);
    }
    sub.onmouseleave = (e) => {
      animateZoom.mainFunc(sub, 1, 0.5, -0.05);
    }
  })
}


function doBlurBackground (parentBlock, focus = false) {
  if (focus) {
    blurSpace.style.zIndex = 50;
    blurSpace.style.background = 'rgba(0, 0, 0, 0.8)';
  } else {
    blurSpace.style.background = 'rgba(0, 0, 0, 0)';
    blurSpace.style.zIndex = 'auto';
  }
  if (!parentBlock.classList.contains('variable')) {
    let callList = parentBlock.childNodes[1].childNodes;
    callList.forEach((call) => {
      let declaratedBlock = document.getElementById('dec-'+call.classList[3].slice(5));
      if (focus) {
        activeLinks.forEach((link) => {
          link[1].style.zIndex = 90;
        })
        declaratedBlock.style.zIndex = 100;
      } else {
        declaratedBlock.style.zIndex = 'auto';
        activeLinks.forEach((link) => {
          link[1].style.zIndex = 'auto';
        })
      }
    })
  }
}


function getActiveLinks (block) {
  activeLinks = [];
  let list = block.querySelectorAll('.vertex');
  let pushList = []
  list.forEach((vertex) => {
    if (vertex.classList[0] == 'v2') {
      let id = vertex.id.split('..');
      let vertex1 = document.getElementById(id[0]);
      let link = document.getElementById(id.join('.'));
      let vertex2 = vertex;
      let path = link.firstChild;
      if (vertex2.classList[2] == 'v-func') {
        activeLinks.push([vertex1, link, vertex2, path]);
      } else {
        activeLinks.push([vertex1, link, vertex2, path]);
      }
    }
  })
}


function addMouseEvent () {
  let parentBlocks = workSpace.querySelectorAll('.main-parent');
  parentBlocks.forEach((block) => {
    block.onmouseenter = (e) => {
      getActiveLinks(block);
      block.style.zIndex = 100;
      mainParent = block;
      doZoomPlusByHidden();
      vertexBlock = mainParent.querySelector('.vertex-block');
      doBlurBackground(block, true);
    }
    block.onmouseleave = (e) => {
      block.style.zIndex = 'auto';
      doZoomMinusByHidden();
      doBlurBackground(block);
      mainParent = false;
      activeLinks = [];
    }
  })
  workSpace.querySelectorAll('.call-var, .call-func').forEach((call) => {
    call.onmouseenter = (e) => {
      focusVertex = vertexBlock.querySelector('.call-'+call.innerText);
      focusColor = window.getComputedStyle(focusVertex).backgroundColor;
      decVertex = document.getElementById(focusVertex.id.split('..')[0]);
      focusVertex.style.background = 'aqua';
      focusVertex.style.transform = 'scale(1.3)';
      decVertex.style.background = 'aqua';
      decVertex.style.transform = 'scale(1.3)';
      focusLink = document.getElementById(focusVertex.id.split('..').join('.'));
      focusLink.style.zIndex = 91;
      focusLink.firstChild.setAttribute('stroke', 'aqua');
      focusLink.firstChild.setAttribute('stroke-width', 4);
    }
    call.onmouseleave = (e) => {
      focusLink.firstChild.setAttribute('stroke', focusColor);
      focusVertex.style.background = focusColor;
      decVertex.style.background = focusColor;
      decVertex.style.transform = 'scale(1)';
      focusVertex.style.transform = 'scale(1)';
      focusLink.firstChild.setAttribute('stroke-width', 2);
      focusLink.style.zIndex = 90;
    }
  })
}


function runEventCore () {
  addMouseEvent();
  getZoomSubBlock();
}
