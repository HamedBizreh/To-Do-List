// File: js/app.js
// Student: Hamed Bizreh (12428049)
// This file is intentionally incomplete.
// Your task is to implement the required behaviour using JavaScript and the Fetch API.

/*
  API ENDPOINTS (already implemented on the server):

  Base URL:
    http://portal.almasar101.com/assignment/api

  1) Add task  (POST)
     add.php?stdid=STUDENT_ID&key=API_KEY
     Body (JSON): { "title": "Task title" }
     Returns JSON with the added task.

  2) Get tasks (GET)
     get.php?stdid=STUDENT_ID&key=API_KEY
     - If "id" is omitted: returns all tasks for this student.
     - If "id=NUMBER" is provided: returns one task.

  3) Delete task (GET or DELETE)
     delete.php?stdid=STUDENT_ID&key=API_KEY&id=TASK_ID
     Deletes the task with that ID for the given student.
*/

// Configuration for this student (do not change STUDENT_ID value)
const STUDENT_ID = "12428049";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

// Grab elements from the DOM
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

/**
 * Helper to update status message.
 * You can use this in your code.
 */
function setStatus(message, isError = false) {
  if (!statusDiv) return;
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666666";
}

async function loadTasksOnLoad(){
    setStatus(`Loading Tasks...⏳`);
    try{
        const response = await fetch(`${API_BASE}/get.php?stdid=${STUDENT_ID}&key=${API_KEY}`);
        if(!response.ok){
            throw new Error("Failed To Load Tasks" + response.status);
        }
        else{
            const data = await response.json();
            const loadedTasks = data.tasks;
            console.log(loadedTasks);
            for(let task of loadedTasks){
                renderTask(task);
            }
            setTimeout(()=>{setStatus()},300);
        }
    }
    catch(err){
        console.error(err);
        setStatus("Error loading tasks");
    }
  }
/**
 * TODO 1:
 * When the page loads, fetch all existing tasks for this student using:
 *   GET: API_BASE + "/get.php?stdid=" + STUDENT_ID + "&key=" + API_KEY
 * Then:
 *   - Parse the JSON response.
 *   - Loop over the "tasks" array (if it exists).
 *   - For each task, create an <li> with class "task-item"
 *     and append it to #task-list.
 */
document.addEventListener("DOMContentLoaded", async function () {
  // TODO: implement load logic using fetch(...)
   loadTasksOnLoad();
});


/**
 * TODO 2:
 * When the form is submitted:
 *   - prevent the default behaviour.
 *   - read the value from #task-input.
 *   - send a POST request using fetch to:
 *       API_BASE + "/add.php?stdid=" + STUDENT_ID + "&key=" + API_KEY
 *     with headers "Content-Type: application/json"
 *     and body JSON: { title: "..." }
 *   - on success, add the new task to the DOM and clear the input.
 */
if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    // TODO: implement add-task logic here
    async function addTask() {
        
    const enteredTask = input.value.trim();
      if (!enteredTask) return;
      setStatus("Adding task...⏳");
      try {
        const response = await fetch(`${API_BASE}/add.php?stdid=${STUDENT_ID}&key=${API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: enteredTask }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to add task: " + response.status);
        }
        const data = await response.json();
        renderTask(data.task);
        setStatus("Task Added Successfully!");
        setTimeout(()=>{setStatus()},1500);
      } catch (err) {
        console.error(err);
      }
    }
    addTask();
  });
}

/**
 * TODO 3:
 * For each task that you render, create a "Delete" button.
 * When clicked:
 *   - send a request to:
 *       API_BASE + "/delete.php?stdid=" + STUDENT_ID + "&key=" + API_KEY + "&id=" + TASK_ID
 *   - on success, remove that <li> from the DOM.
 *
 * You can create a helper function like "renderTask(task)" that:
 *   - Creates <li>, <span> for title, and a "Delete" <button>.
 *   - Attaches a click listener to the delete button.
 *   - Appends the <li> to #task-list.
 */
function deleteTask(taskID,deletedElement) {
    setStatus("Deleting Task...");

    
    const deleteOverlay = document.createElement('div');
    deleteOverlay.classList.add('deleteOverlay');


    const deletePopUp = document.createElement('div');
    deletePopUp.classList.add('deletePopUp');
    deletePopUp.textContent = 'Are You Sure You Want To Delete This Task?';


    const buttons = document.createElement('div');
    buttons.classList.add('buttons');

    
    const yesButton = document.createElement('button');
     yesButton.classList.add('btn' , 'yes');
     yesButton.textContent = 'Yes';


    const noButton = document.createElement('button');
    noButton.classList.add('btn' , 'no');
    noButton.textContent = 'No';

    buttons.appendChild(yesButton);
    buttons.appendChild(noButton);
    deletePopUp.appendChild(buttons);
    deleteOverlay.appendChild(deletePopUp);
    document.body.appendChild(deleteOverlay);


    yesButton.addEventListener('click',async ()=>{
      try{
      const response = await fetch(`${API_BASE}/delete.php?stdid=${STUDENT_ID}&key=${API_KEY}&id=${taskID}`);
      if (!response.ok) {
          throw new Error("Failed to delete task: " + response.status);
      }
      }
      catch(err){
        console.error(err);
      }

      deletedElement.remove();
      setStatus("Task Deleted Successfully!");
      deleteOverlay.remove();
      deletePopUp.remove();
      buttons.remove();
      setTimeout(()=>{setStatus()}, 1500);
    })

    noButton.addEventListener('click',()=>{
      deleteOverlay.remove();
      deletePopUp.remove();
      buttons.remove();
      setTimeout(()=>{setStatus()}, 500);
    })
    
  
}



// Suggested helper (you can modify it or make your own):
function renderTask(task) {
  // Expected task object fields: id, title, stdid, is_done, created_at (depends on API)
  // TODO: create the DOM elements and append them to list
    const addedTask = document.createElement("li");
    addedTask.classList.add("task-item");
    const span = document.createElement("span");
    span.textContent = task.title;
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add('task-delete');
    deleteBtn.textContent = "x";
    addedTask.appendChild(span);
    addedTask.appendChild(deleteBtn);
    list.appendChild(addedTask);
    deleteBtn.addEventListener('click',()=>deleteTask(task.id,addedTask));
    input.value = "";
}