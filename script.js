//Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");


//Event Listeners
document.addEventListener("DOMContentLoaded", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTodo);

//Functions 
function addTodo(event){
    // Prevent form from Submitting
    event.preventDefault(); 
    //Todo DIV
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    //Create LI
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-time"); 
    todoDiv.appendChild(newTodo);
    //ADD TODO LOCAL STORAGE
    saveLocalTodos(todoInput.value);
    //CHECK MARK BUTTON
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton); 
     //CHECK trash BUTTON
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    //APPEND TO LIST
    todoList.appendChild(todoDiv);
    // Clear Todo INPUT VALUE
    todoInput.value = "";
}

function deleteCheck(e){
    const item = e.target;
     //DELETE TODO
    if(item.classList[0] === "trash-btn") {
        const todo = item.parentElement;
        //Animation
        todo.classList.add("fall");
        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function() {
            todo.remove();
        });
    }

    //CHECK MARK
    if(item.classList[0] === "complete-btn") {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }
}


function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach(function(todo) {
        switch(e.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if(todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "uncompeleted":
                if (!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                } 
                break;
        }
    });
    
}

function saveLocalTodos(todo){
    //CHECk ---- HEY Do I already have thing in there?
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    } 

    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos(){
    //CHECk ---- HEY Do I already have thing in there?
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    } 
    todos.forEach(function(todo){
         //Todo DIV
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    //Create LI
    const newTodo = document.createElement("li");
    newTodo.innerText = todo;
    newTodo.classList.add("todo-time"); 
    todoDiv.appendChild(newTodo);
    
    //CHECK MARK BUTTON
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton); 
     //CHECK trash BUTTON
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    //APPEND TO LIST
    todoList.appendChild(todoDiv);
    });
}

function removeLocalTodos(todo) {
    //CHECk ---- HEY Do I already have thing in there?
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    } 
    const todoIndex = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoIndex), 1);
        localStorage.setItem("todos", JSON.stringify(todos));
}



// EDIT TODO FUNCTIONALITY - Works on both desktop & mobile
let lastTap = 0;

todoList.addEventListener('dblclick', handleEdit);
todoList.addEventListener('touchend', (e) => {
    const now = Date.now();
    const timeDiff = now - lastTap;
    if (timeDiff < 300 && timeDiff > 0) {
        handleEdit(e);
    }
    lastTap = now;
});

function handleEdit(e) {
    const todoItem = e.target.closest('.todo-time');
    if (!todoItem) return;

    // Agar already edit mode mein hai to skip
    if (todoItem.querySelector('.edit-input')) return;

    const currentText = todoItem.innerText.trim();

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = currentText;
    editInput.classList.add('edit-input');

    todoItem.innerText = '';
    todoItem.appendChild(editInput);
    editInput.focus();

    const saveEdit = () => {
        const newText = editInput.value.trim();
        if (newText && newText !== currentText) {
            todoItem.innerText = newText;
            updateLocalTodo(currentText, newText);
        } else {
            todoItem.innerText = currentText;
        }
    };

    editInput.addEventListener('blur', saveEdit);
    editInput.addEventListener('keypress', (ev) => {
        if (ev.key === 'Enter') editInput.blur();
    });
}

function updateLocalTodo(oldText, newText) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    const index = todos.indexOf(oldText);
    if (index !== -1) {
        todos[index] = newText;
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}


/*  DARK MODE TOGGLE  */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Load saved theme on page load
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

// Toggle theme on click
themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    
    // Switch icon
    if (isDark) {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    } else {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
});