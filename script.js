document.addEventListener('DOMContentLoaded', () => {
 const todoInput = document.getElementById('todo-input');
 const addTodoBtn = document.getElementById('add-todo-btn');
 const todoList = document.getElementById('todo-list');
 addTodoBtn.addEventListener('click', addTask);
 todoInput.addEventListener('keypress', (event) => {
 if (event.key === 'Enter') {
 addTask();
 }
 });
 function addTask() {
 const taskText = todoInput.value.trim();
 if (taskText === '') {
 alert('Please enter a task!');
 return;
 }
 const listItem = document.createElement('li');
 listItem.innerHTML = `
 <span>${taskText}</span>
 <div>
 <button class="complete-btn">Complete</button>
 <button class="delete-btn">Delete</button>
 </div>
 `;
 // Add event listener for completing a task
 const completeBtn = listItem.querySelector('.complete-btn');
 completeBtn.addEventListener('click', () => {
 listItem.classList.toggle('completed');
 completeBtn.textContent = listItem.classList.contains('completed'
) ? 'Undo' : 'Complete';
 });
 // Add event listener for deleting a task
 const deleteBtn = listItem.querySelector('.delete-btn');
 deleteBtn.addEventListener('click', () => {
 todoList.removeChild(listItem);
 });
 todoList.appendChild(listItem);
 todoInput.value = ''; // Clear input field
 }
});