const TO_DO_KEY_FOR_TASKS = 'TO_DO_KEY_FOR_TASKS';

const addButton = document.getElementById('add-task');
const newTaskText = document.getElementById('new-task-text');

let title = '';

const tasks = getTasksFromLocalStorage();

loadCards();

setOptionValues();

addButton.addEventListener('click', () => {

    console.log(newTaskText?.value?.length)
    if (!(newTaskText?.value?.length > 0)) return;

    const task = {
        text: newTaskText.value,
        isCompleted: false
    }

    tasks.unshift(task);
    saveTasksInLocalStorage();
    newTaskText.value = '';

    removeTasksFromHtml();
    loadCards();
    setOptionValues();
});


function getAllTasksCount() {
    return tasks.length;
}

function getCompletedTasksCount() {
    return tasks.filter(x => x.isCompleted).length;
}

function getUncompletedTasksCount() {
    return tasks.filter(x => !x.isCompleted).length;
}


function saveTasksInLocalStorage() {
    const taskJSON = JSON.stringify(tasks);
    localStorage.setItem(TO_DO_KEY_FOR_TASKS, taskJSON);
}

function getTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem(TO_DO_KEY_FOR_TASKS);
    if (!storedTasks) return [];

    return JSON.parse(storedTasks);
}

function loadCards() {

    for (let index = 0; index < tasks.length; index++) {
        const newCard = document.createElement('div');
        newCard.classList.add('card');

        const newCheckbox = document.createElement('input');
        newCheckbox.type = 'checkbox';
        newCheckbox.checked = tasks[index].isCompleted;
        newCheckbox.classList.add('td-checkbox--m');

        tasks[index].onCompleteChange = () => {
            tasks[index].isCompleted = newCheckbox.checked;
            saveTasksInLocalStorage();
            setOptionValues();
        }

        newCheckbox.addEventListener('change', tasks[index].onCompleteChange);


        const newText = document.createElement('p');
        newText.classList.add('card__text');
        newText.textContent = tasks[index].text;

        const newControls = document.createElement('div');
        newControls.classList.add('card__controls');

        const editButton = document.createElement('button');
        editButton.classList.add('button', 'button--edit');

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('button', 'button--delete');

        tasks[index].onDelete = () => {
            removeTasksFromHtml();
            tasks.splice(index, 1);
            saveTasksInLocalStorage();
            setOptionValues();
            loadCards();
        };

        deleteButton.addEventListener('click', tasks[index].onDelete);

        const binImg = document.createElement('img');
        binImg.src = 'assets/images/bin-svgrepo-com.svg';

        deleteButton.appendChild(binImg);
        newControls.appendChild(editButton);
        newControls.appendChild(deleteButton);
        newCard.appendChild(newCheckbox);
        newCard.appendChild(newText);
        newCard.appendChild(newControls);

        const container = document.getElementById('list-task');
        container.appendChild(newCard);
    }
}


function removeTasksFromHtml() {
    const deleteButtons = document.getElementsByClassName('button--delete');

    console.log(deleteButtons)

    Array.from(deleteButtons).forEach((btn, index) => {
        btn.removeEventListener('click', tasks[index].onDelete)
    });

    const htmlTasks = document.getElementsByClassName('card');

    Array.from(htmlTasks).forEach(elem => {
        elem.remove();
    });
}


function setOptionValues() {
    const allOption = document.getElementById('all-option');
    const completedOption = document.getElementById('completed-option');
    const uncompletedOption = document.getElementById('uncompleted-option');

    allOption.textContent = `All (${getAllTasksCount()})`;
    completedOption.textContent = `Completed (${getCompletedTasksCount()})`;
    uncompletedOption.textContent = `Uncompleted (${getUncompletedTasksCount()})`;
}
