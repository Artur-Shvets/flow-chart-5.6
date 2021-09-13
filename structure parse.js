"use strict"

let input = document.getElementById('input');
let inputText;
let openBrace;
let closedBrace;
let mainParent = false;
let vertexBlock = false;
let subBlock = false;
let rowBlock = false;
let mainBlock = false;
let identBlock;


function addColorForBlock (block, rowText) {
  if (/\b(window|document|console)\./g.test(rowText)) {
    block.classList.add('orange-shadow');
  } else if (/\b(for|forEach)\b/g.test(rowText)) {
    block.classList.add('blue-shadow');
  } else if (/\b(var|const|while|let|function|if\b)/g.test(rowText)) {
    block.classList.add('purple-shadow');
  }
}

function createParent (rowText) {
  mainParent = document.createElement('div');
  mainParent.classList.add('main-parent', 'main-block');
  mainParent.setAttribute('contenteditable', 'false');
  addColorForBlock (mainParent, rowText);
  input.append(mainParent);
  createRow(rowText, 'row', true);
  mainParent.append(rowBlock);
  mainBlock = mainParent;
}

function createMainBlock (rowText) {
  mainBlock = document.createElement('div');
  mainBlock.classList.add('main-block');
  subBlock.append(mainBlock);
  addColorForBlock(mainBlock, rowText);
  createRow(rowText, 'row');
  mainBlock.append(rowBlock);
  createSubBlock();
}

function createVertexBlock () {
  vertexBlock = document.createElement('div');
  vertexBlock.classList.add('vertex-block');
  mainBlock.append(vertexBlock);
}


function createSubBlock () {
  if (mainParent.querySelector('.sub-block') == null) {
    createVertexBlock();
  }
  subBlock = document.createElement('div');
  subBlock.classList.add('sub-block');
  mainBlock.append(subBlock);
}

function createRow (rowText, type, main = false) {
  rowBlock = document.createElement('div');
  rowBlock.innerHTML = getHighlightText(rowText);
  if (declaratedFunc) {
    mainParent.id = 'dec-'+declaratedFunc;
    mainParent.classList.add('function');
  }
  if (declaratedVar && !declaratedFunc) {
    mainParent.id = 'dec-'+declaratedVar;
    mainParent.classList.add('variable');
    declaratedVar = false;
  }
  if (type == 'row') {
    rowBlock.classList.add('row');
  } else {
    rowBlock.classList.add('row-block');
    addColorForBlock(rowBlock, rowText);
  }
}

function createIndent () {
  identBlock = document.createElement('div');
  identBlock.classList.add('ident-block');
  identBlock.innerText = '\n';
  input.append(identBlock);
}

function getPreviousBlocks () {
  if (mainBlock.classList.contains('main-parent') != true) {
    subBlock = mainBlock.parentElement;
    mainBlock = subBlock.parentElement;
  } else {
    mainParent = false;
    mainBlock = false;
    subBlock = false;
    declaratedFunc = false;
  }
}


let countIdent = 0;
function parserCore() {
  inputText = input.innerText.split('\n');
  getAllVarNames(input.innerText);
  getAllFuncNames(input.innerText);
  input.innerText = null;
  inputText.forEach((rowText) => {
    openBrace = /{$/gm.test(rowText);
    closedBrace = /^\s*?}/gm.test(rowText);
    if (openBrace && !closedBrace) {
      if (mainParent) {
        createMainBlock(rowText);
      } else {
        createParent(rowText);
        createSubBlock();
      }
    } else if (!openBrace && closedBrace) {
      createRow(rowText, 'row');
      mainBlock.append(rowBlock);
      getPreviousBlocks();
    } else if (openBrace && closedBrace) {
      createRow(rowText, 'row');
      mainBlock.append(rowBlock);
      createSubBlock();
    } else {
      if (mainParent) {
        createRow(rowText, 'block');
        if (subBlock) {
          subBlock.append(rowBlock);
        } else {
          mainBlock.append(rowBlock);
        }
      } else {
        if (rowText.length == 0) {
          countIdent += 1;
          if (countIdent % 2 == 0) {
            countIdent = 0;
            createIndent();
          }
        } else {
          createParent(rowText);
          mainParent = false;
          mainBlock = false;
          subBlock = false;
          declaratedFunc = false;
        }
      }
    }
  })
  buildFlowChart();
}
