"use strict"

let vertex1;
let vertex2;
let svg;
let path;
let idList = [[]];
let left = 40;


function showVariables () {
  let variables = input.querySelectorAll('.variable');
  let top = 60;
  let nextLeft = 0;
  variables.forEach((variable) => {
    variable.style.position = 'absolute';
    variable.style.left = `${left}px`;
    variable.style.top = `${top}px`;
    workSpace.append(variable);
    top += 40;
    let width = variable.offsetWidth;
    if (width > nextLeft) {
      nextLeft = width;
    }
  })
  left += nextLeft + 200;
}


function getFuncLevels () {
  let result = [];
  let allFunc = functionNames;
  let levelUp;
  let allFuncCalls = {};
  input.querySelectorAll('.function').forEach((parent) => {
    let parentName = parent.id.slice(4);
    allFuncCalls[parentName] = [];
    parent.querySelectorAll('.call-func').forEach((call) => {
      allFuncCalls[parentName].push(call.innerText);
    })
  })
  while (allFunc.length > 0) {
    levelUp = [];
    allFunc.forEach((name, e) => {
      allFuncCalls[name].forEach((call) => {
        allFunc.forEach((func) => {
          if (call == func) {
            delete allFunc[e];
            levelUp.push(name);
          }
        })
      })
    })
    result.push(allFunc.filter(Boolean));
    allFunc = Array.from(new Set(levelUp));
  }
  return result
}


function showFunctions (funcLvl) {
  funcLvl.forEach((level) => {
    let top = 60;
    let nextLeft = 0;
    level.forEach((name) => {
      let declaratedFunc = document.getElementById('dec-'+name);
      declaratedFunc.style.position = 'absolute';
      declaratedFunc.style.left = `${left}px`;
      declaratedFunc.style.top = `${top}px`;
      workSpace.append(declaratedFunc);
      top += declaratedFunc.offsetHeight + 20;
      let width = declaratedFunc.offsetWidth;
      if (width > nextLeft) {
        nextLeft = width;
      }
    })
    left += nextLeft + 200;
  })
}


function showOtherBlocks (funcLvl) {
  input.querySelectorAll('.main-parent').forEach((parent) => {
    if (parent.querySelector('.call-func')) {
      let callFuncLvl = [];
      parent.querySelectorAll('.call-func').forEach((call) => {
        funcLvl.forEach((lvl, i) => {
          callFuncLvl.push(i);
        })
      })
    }
  })
}


function createVertex (block, v, type) {
  if (v == 1) {
    vertex1 = document.createElement('span');
    vertex1.className = 'v1 vertex '+type;
    block.firstChild.append(vertex1);
  } else if (v == 2) {
    vertex2 = document.createElement('span');
    vertex2.className = 'v2 vertex '+type;
    block.append(vertex2);
  }
}


function createLink (type) {
  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = "position:absolute";
  document.getElementById('svg-space').append(svg);
  path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('stroke-width', 2);
  if (type == 'type-func') {
    path.setAttribute('stroke', '#C792EA');
  } else {
    path.setAttribute('stroke', 'rgba(255, 255, 255, 0.2)');
  }
  path.setAttribute('fill', 'transparent');
  svg.append(path);
}


function createIdOfLinks () {
  if (vertex1.id == '') {
    let parentId = idList.length;
    let pushIdList = [parentId, [parentId+'.'+'1'], [parentId+'..'+'1']];
    vertex1.id = pushIdList[0];
    svg.id = pushIdList[1];
    vertex2.id = pushIdList[2];
    idList.push(pushIdList);
  } else {
    let parentId = vertex1.id;
    let linkId = parentId+'.'+(Number(idList[parentId][1][idList[parentId][1].length - 1].split('.')[1])+1);
    let secondVertexId = parentId+'..'+linkId.split('.')[1];
    svg.id = linkId;
    vertex2.id = secondVertexId;
    idList[parentId][1].push(linkId);
    idList[parentId][2].push(secondVertexId);
  }
}


function getMainParent (childBlock) {
  while (childBlock.classList.contains('main-parent') != true) {
    childBlock = childBlock.parentElement;
  }
  return childBlock
}


function createAllLinks (declaratedList, type) {
  let calledList;
  declaratedList.forEach((parent) => {
    createVertex(parent, 1, type);
    calledList = workSpace.querySelectorAll('.'+parent.id.slice(4) + `.call-${type.slice(5)}`);
    calledList.forEach((call) => {
      mainParent = getMainParent(call);
      vertexBlock = mainParent.querySelector('.vertex-block');
      if (vertexBlock.querySelector('.call-'+call.innerText) == null) {
        createVertex(mainParent.querySelector('.vertex-block'), 2, `${type} call-${call.innerText}`);
        createLink(type);
        createIdOfLinks();
      }
    })
  })
}


function doDynamicAllLinks () {
  let len = idList.length
  for (let i = 1; i < len; i++) {
    idList[i][1].forEach((svg, e, list) => {
      let vertex1 = document.getElementById(idList[i][0]);
      let link = document.getElementById(svg);
      let vertex2 = document.getElementById(idList[i][2][e]);
      let path = link.children[0];
      let x1 = vertex1.getBoundingClientRect().x + window.scrollX;
      let y1 = vertex1.getBoundingClientRect().y + window.scrollY;
      let x2 = vertex2.getBoundingClientRect().x + window.scrollX;
      let y2 = vertex2.getBoundingClientRect().y + window.scrollY;
      vertex2.style.left = x2 + 'px';
      vertex2.style.top = y2 + 'px';
      link.style.left = Math.min(x1, x2)+4+'px';
      link.style.top = Math.min(y1, y2)+4+'px';
      link.setAttribute('width', Math.abs(x1 - x2)+2+'px');
      link.setAttribute('height', Math.abs(y1 - y2)+2+'px');
      let centerWidth = Math.abs(x1 - x2) / 2;
      let height = Math.abs(y1 - y2) + 1;
      let width = Math.abs(x1 - x2) + 1;
      if (x2 < x1 & y2 < y1 || x2 > x1 & y2 > y1) {
        path.setAttribute('d', 'M '+' '+0+' '+1+' C '+centerWidth+' '+1+', '+centerWidth+' '+height+' '+width+' '+height);
      } else {
        path.setAttribute('d', 'M '+' '+0+' '+height+' C '+centerWidth+' '+height+', '+centerWidth+' '+1+' '+width+' '+1);
      }
    })
  }
}


function buildFlowChart () {
  window.scroll(0, 0);
  showVariables();
  let levelsOfFunc = getFuncLevels();
  showFunctions(levelsOfFunc);
  showOtherBlocks(levelsOfFunc);
  createAllLinks(workSpace.querySelectorAll('.function'), 'type-func');
  createAllLinks(workSpace.querySelectorAll('.variable'), 'type-var');
  doDynamicAllLinks();
  runEventCore();
  input.innerText = null;
}
