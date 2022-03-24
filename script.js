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
document.forms.mainForm.addEventListener('keydown', addTodo);
formContainer.addEventListener('click', changeTodoState);
document.forms.statusForm.addEventListener('change', changeStatus);
formContainer.addEventListener('click', deleteTodo);
formContainer.addEventListener('dblclick', editTodo);
// formContainer.addEventListener('keydown', saveEditedTodo);
formContainer.addEventListener('focusout', saveEditedTodo);

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
    todosUI.forEach(todoUI => todoUI.remove());

    const todoExample = document.forms.myForm.cloneNode(true);
    todoExample.classList.remove('hide');
    todos.forEach(({ text, id, checked }) => {
        const todoUI = todoExample.cloneNode(true);
        todoUI.textInput.value = text;
        todoUI.checkbox.checked = checked;
        todoUI.textInput.parentElement.dataset.key = id;
        formContainer.prepend(todoUI)
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

function editTodo({ target }) {
    if (target.type != 'text') return;

    target.disabled = false;
    target.focus();
}

function saveEditedTodo(event) {
    if (event.type == 'focusout' ||
        event.keyCode == 13
    ) {
    const { target } = event;
    console.log(target);
    const ownKey = +target.parentElement.dataset.key;
    const newTodos = getTodos().map((todo) => {
        if (todo.id === ownKey)
            todo.text = target.value;
        return todo;
    })
    setTodos(newTodos);
    renderByStatus();
}

    
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

    const radioButtons = Array.from(document.forms.statusForm.querySelectorAll('input[type=radio]'));
    radioButtons.forEach(radio => {
        if (radio.value === status)
            radio.checked = true;
    })
}

renderByStatus();