function getStatus() {
    return localStorage.getItem('status') || 'All';
}

function setStatus(status) {
    localStorage.setItem('status', status);
}

function getTodos() {
    return JSON.parse(localStorage.getItem('todos')) || [];
}

function setTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

const formContainer = document.getElementsByClassName('formContainer')[0];
const toggler = document.getElementsByClassName('toggle-all')[0];
document.forms.mainForm.addEventListener('keydown', addTodo);
formContainer.addEventListener('click', changeTodoState);
document.forms.statusForm.addEventListener('change', changeStatus);
formContainer.addEventListener('click', deleteTodo);
formContainer.addEventListener('dblclick', focusTodo);
formContainer.addEventListener('input', editTodo);
toggler.addEventListener('click', toggleTodos);

function changeTodoState({ target }) {
    if (target.type != 'checkbox') return;

    const ownKey = +target.parentElement.dataset.key;
    const newTodos = getTodos().map((todo) => {
        if (todo.id === ownKey)
            todo.checked = !todo.checked;
        return todo;
    })
    setTodos(newTodos);
    renderByStatus();
}

function addTodo(event) {
    if (event.keyCode != 13) return;

    const todo = {
        text: event.target.value,
        id: (new Date()).getTime(),
        checked: false
    }
    const newTodos = [...getTodos(), todo]; 
    event.target.value = '';
    setTodos(newTodos);
    renderByStatus();
}

function renderTodos(todos) {
    const formContainer = document.getElementsByClassName('formContainer')[0];
    const todosUI = Array.from(formContainer.children);
    let focusedIndex = todosUI.reduce((acc,todoUI, i) => {
        if (todoUI.textInput == document.activeElement) {
            todoUI.remove();
            return i;
        }
        todoUI.remove();
        return acc;
    }, null);

    const todoExample = document.forms.myForm.cloneNode(true);
    todoExample.classList.remove('hide');
    todos.forEach(({ text, id, checked }, i) => {
        const todoUI = todoExample.cloneNode(true);
        todoUI.textInput.value = text;
        todoUI.checkbox.checked = checked;
        todoUI.textInput.parentElement.dataset.key = id;
        todoUI.textInput.disabled = true;
        formContainer.prepend(todoUI);
        if (todos.length - 1 - i === focusedIndex) {
            todoUI.textInput.disabled = false;
            todoUI.textInput.focus();
        }  
    })
}

function changeStatus({ target }) {
    if (target.type != 'radio') return;
    setStatus(target.value);
    renderByStatus();
}

function deleteTodo(event) {
    if (event.target.type === "button") {
      const id = +event.target.parentElement.dataset.key;
      let todos = getTodos();
      todos = todos.filter((item) => item.id !== id);
      setTodos(todos);
      renderByStatus();
    }
}

function focusTodo({ target }) {
    if (target.type != 'text') return;

    target.disabled = false;
    target.focus();
}

function editTodo(event) {
    const { target } = event;
    const ownKey = +target.parentElement.dataset.key;
    const newTodos = getTodos().map((todo) => {
        if (todo.id === ownKey)
            todo.text = target.value;
        return todo;
    })
    setTodos(newTodos);
    renderByStatus();
    target.focus(); 
}

function renderStatusButtons(status) {
    const radioButtons = Array.from(document.forms.statusForm.querySelectorAll('input[type=radio]'));
    radioButtons.forEach(radio => {
        if (radio.value === status)
            radio.checked = true;
    });

    const statusButtons = Array.from(document.forms.statusForm.querySelectorAll('label'));
    statusButtons.forEach((btn) => {
        btn.classList.remove('selected');
        status === btn.innerText ? btn.classList.add('selected') : null;
    })
}

function toggleTodos() {
    const todos = getTodos();
    let isExistBothType = false;
    for (let i = 0; i < todos.length - 1; i ++) {
        if (todos[i].checked != todos[i + 1].checked) {
            isExistBothType = true;
            break;
        }
    }

    let newTodos = todos.map(todo => { 
        todo.checked = !todo.checked;
        return todo;
     });

    if (isExistBothType) {
        newTodos = todos.map(todo => {
            todo.checked = true;
            return todo;
        });
    }

    setTodos(newTodos);
    renderByStatus();
}

function isAllTodoCompleted() {
    const toggler = document.getElementsByClassName('toggle-all')[0];
    const todos = getTodos();
    const isAllCompleted = todos.every(todo => todo.checked);
    isAllCompleted ? toggler.classList.add('completed') : toggler.classList.remove('completed');
}

function renderByStatus() {
    const status = getStatus();
    const todos = getTodos();
    switch (status) {
        case 'Active':
            renderTodos(todos.filter(todo => !todo.checked));
            break;
        case 'Completed':
            renderTodos(todos.filter(todo => todo.checked));
            break;
        default:
            renderTodos(todos);
            break;
    }

    renderStatusButtons(status);
    isAllTodoCompleted();
}

renderByStatus();