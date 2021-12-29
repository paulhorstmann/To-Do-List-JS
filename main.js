const addTaskButton = document.getElementById('add-task-button');
const inputTask = document.getElementById('input-task');
const taskList = document.getElementById('task-list');

let taskStore = {
    get: JSON.parse(localStorage.getItem("tasks")) || [],
    update: () => localStorage.setItem("tasks", JSON.stringify(taskStore.get)),
    add: (name, checked) => {
        let id = taskStore.get.length > 0 ? (taskStore.get[taskStore.get.length - 1].id + 1) : 1
        taskStore.get.push({
            id: id,
            name: name,
            checked: checked
        })
        taskStore.update()
        return id;
    },
    toggleChecked: (id) => {
        taskStore.get.forEach((item, i) => {
            if (item.id === id)
                taskStore.get[i].checked = !taskStore.get[i].checked
        })
        taskStore.update()
    },
    remove: (id) => {
        taskStore.get = taskStore.get.filter((item) => {
            return item.id != id;
        })
        taskStore.update()
    }
}

taskStore.get.forEach(item => addToTaskList(item.id, item.name, item.checked))

function addToTaskList(id, name, checked = false) {
    let elm = document.createElement('li')

    elm.classList.add('input-group')
    elm.innerHTML = `
        <div class="input-group-text">
            <input class="form-check-input mt-0" type="checkbox" ${checked ? "checked" : ""}>
        </div>
        <span class="task form-control" style="text-decoration:${checked ? "line-through" : "none"}">${name}</span>
        <button class="btn btn-danger delete-btn" >
            <span class="material-icons">
                delete
            </span>
        </button>
        `

    taskList.append(elm)

    elm = taskList.lastElementChild

    elm.check = elm.children[0].firstElementChild
    elm.name = elm.children[1]
    elm.del = elm.children[2]

    elm.check.addEventListener('click', () => {
        elm.name.style.textDecoration = elm.check.checked ? "line-through" : "none"
        taskStore.toggleChecked(id)
    })

    elm.del.addEventListener('click', () => {
        taskStore.remove(id)
        elm.remove()
    })
}

function handleAddAction() {
    if (!!inputTask.value) {
        addToTaskList(
            taskStore.add(inputTask.value, false),
            inputTask.value
        )
        inputTask.value = ""
    }
}

addTaskButton.addEventListener('click', () => handleAddAction())
inputTask.addEventListener('keydown', (e) => { if (e.keyCode === 13) handleAddAction() })