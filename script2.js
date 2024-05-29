document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.getElementById('addTaskButton').addEventListener('click', addTask);
});

function loadTasks() {
    fetch('/api/tasks')
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = tasks.map(task => `
                <li data-id="${task._id}" class="${task.completed ? 'completed' : ''}">
                    <span>${task.title}</span>
                    <div>
                        <button onclick="toggleTask('${task._id}')">${task.completed ? 'Undo' : 'Complete'}</button>
                        <button onclick="deleteTask('${task._id}')">&times;</button>
                    </div>
                </li>
            `).join('');
        });
}

function addTask() {
    const taskInput = document.getElementById('newTaskInput');
    const taskTitle = taskInput.value.trim();
    if (taskTitle) {
        fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: taskTitle })
        }).then(() => {
            taskInput.value = '';
            loadTasks();
        });
    }
}

function toggleTask(taskId) {
    fetch(`/api/tasks/${taskId}/toggle`, { method: 'PUT' })
        .then(() => loadTasks());
}

function deleteTask(taskId) {
    fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
        .then(() => loadTasks());
}
