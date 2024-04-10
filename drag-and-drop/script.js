const addBtnGroup = document.querySelectorAll('.add-btn-group')
const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.querySelector('#backlog-list');
const progressList = document.querySelector('#progress-list');
const completeList = document.querySelector('#complete-list');
const onHoldList = document.querySelector('#on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let curColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}
// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold']
  arrayNames.forEach((name, i) => { localStorage.setItem(`${name}Items`, JSON.stringify(listArrays[i])) });
}

const filterArrays = (array) => array.filter(item => item !== null);


// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.textContent = item;
  listEl.id = index;
  listEl.classList.add("drag-item");
  listEl.draggable = true;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  listEl.setAttribute("ondragstart", "drag(event)");
  //add another function which takes care of the click
  listEl.setAttribute("onclick", "editable(event)");
  // Append
  columnEl.append(listEl);
}

// additional function to handle click and make it also work in firefox
function editable(e) {
  // set the clicked list element as editable
  e.target.contentEditable = true;
  //set the focus on this element in order to be able to change the text
  // and to keep the drag functionality working
  e.target.focus();
}




function setValuesToCreateItemEl(columnEl, column, listArray) {
  columnEl.textContent = '';
  listArray.forEach((item, index) => createItemEl(columnEl, column, item, index));
}
// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) getSavedColumns();

  // Backlog Column
  setValuesToCreateItemEl(backlogList, 0, backlogListArray);
  backlogListArray = filterArrays(backlogListArray);
  // Progress Column
  setValuesToCreateItemEl(progressList, 1, progressListArray);
  progressListArray = filterArrays(progressListArray);
  // Complete Column
  setValuesToCreateItemEl(completeList, 2, completeListArray);
  completeListArray = filterArrays(completeListArray);
  // On Hold Column
  setValuesToCreateItemEl(onHoldList, 3, onHoldListArray);
  onHoldListArray = filterArrays(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage

  updatedOnLoad = true;
  updateSavedColumns();
}

function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!selectedColumnEl[id].textContent.trim()) delete selectedArray[id]
  else selectedArray[id] = selectedColumnEl[id].textContent;
  updateDOM();
}


function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';

}
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}



function rebuildArrays() {
  const pushTextContent = (childrenList) => Array.from(childrenList).map(i => i.textContent);

  backlogListArray = pushTextContent(backlogList.children)
  progressListArray = pushTextContent(progressList.children)
  completeListArray = pushTextContent(completeList.children)
  onHoldListArray = pushTextContent(onHoldList.children)

  updateDOM();
}

function drag(e) { draggedItem = e.target }
function allowDrop(e) { e.preventDefault() }

function drop(e) {
  e.preventDefault();
  // Remove Background Color/Padding
  listColumns.forEach(column => column.classList.remove('over'));
  // Add Item to Column
  const parent = listColumns[curColumn];
  parent.append(draggedItem);
  rebuildArrays();
}

function dragEnter(column) {
  listColumns[column].classList.add('over');
  curColumn = column;
}

listColumns.forEach((list, i) => {
  list.addEventListener('drop', drop);
  list.addEventListener('dragover', allowDrop);
  list.addEventListener('dragenter', () => dragEnter(i));
});
addBtnGroup.forEach((group, i) => {
  group.addEventListener('click', (e) => {
    if (e.target.closest('.add-btn:not(.solid)')) showInputBox(i);
    if (e.target.closest('.solid')) hideInputBox(i);
  });
});
addItems.forEach(item => item.setAttribute('contenteditable', true));
(function init() {
  updateDOM();
})();