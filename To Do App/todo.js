const todoform = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUl = document.getElementById('todo-List');

let allTodos = loadTodosFromLocalStorage();

todoform.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo();
});

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText.length > 0) {
        allTodos.push({ text: todoText, completed: false }); // ✅ store as object
        saveTodosToLocalStorage();
        updateTodoList();
        todoInput.value = "";
    }
}

function updateTodoList() {
    todoListUl.innerHTML = "";
    allTodos.forEach((todo, index) => {
        const todoItem = createTodoItem(todo, index);
        todoListUl.append(todoItem);
    });
}

function createTodoItem(todo, index) {
    // ✅ Fix if old data is string, convert to object
    if (typeof todo === 'string') {
        todo = { text: todo, completed: false };
    }

    const todoId = `todo-${index}`;
    const todoLi = document.createElement('li');
    todoLi.className = "todo";

    todoLi.innerHTML = `
        <input id="${todoId}" type="checkbox" class="hidden-checkbox" ${todo.completed ? 'checked' : ''} />
        <label class="custom-checkbox" for="${todoId}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </svg>
        </label>
        <label for="${todoId}" class="todo-text">${todo.text}</label>
        <button class="delete">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
            </svg>
        </button>
    `;

    // ✅ Handle delete
    const deleteBtn = todoLi.querySelector('.delete');
    deleteBtn.addEventListener('click', () => {
        allTodos.splice(index, 1);
        saveTodosToLocalStorage();
        updateTodoList();
    });

    // ✅ Handle checkbox toggle
    const checkbox = todoLi.querySelector(`#${todoId}`);
    checkbox.addEventListener('change', () => {
        allTodos[index].completed = checkbox.checked;
        saveTodosToLocalStorage();
    });

    return todoLi;
}

function saveTodosToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(allTodos));
}

function loadTodosFromLocalStorage() {
    const todos = localStorage.getItem('todos');
    if (!todos) return [];

    try {
        const parsed = JSON.parse(todos);

        // 🛠️ Convert any string-based todos to objects
        if (Array.isArray(parsed)) {
            return parsed.map(todo => {
                return typeof todo === 'string'
                    ? { text: todo, completed: false }
                    : todo;
            });
        }
    } catch (e) {
        console.error('Failed to parse todos from localStorage:', e);
    }

    return [];
}

// ✅ Initial render
updateTodoList();
