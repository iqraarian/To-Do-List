document.addEventListener("DOMContentLoaded",function (){
  const taskInput=document.getElementById("task-title");
  const descInput=document.getElementById("task-description");
  const addBtn=document.getElementById("add-task-btn");
  const taskList=document.getElementById("task-list");
  const clearBtn=document.getElementById("clear-completed");
  const countDisplay=document.getElementById("count-text");
  const filterButtons=document.querySelectorAll(".filter-btn");

  let tasks=JSON.parse(localStorage.getItem("myTasks")) || [];
  let currentFilter="all";
  showTasks();

  addBtn.addEventListener("click",addNewTask);
  clearBtn.addEventListener("click",clearDoneTasks);

  filterButtons.forEach((button)=>{
    button.addEventListener("click",() =>{
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      currentFilter=button.dataset.filters;
      showTasks();
    });
  });

  function addNewTask(){
    const title=taskInput.value.trim();
    const desc=descInput.value.trim();

    if (title === ""){
      alert("Please enter a task title!");
      return;
    }
    const newTask={
      title:title,
      description:desc,
      completed:false,
      id:Date.now(),
    };

    tasks.push(newTask);
    saveTasks();
    showTasks();

    taskInput.value="";
    descInput.value="";
    taskInput.focus();
  }

  function showTasks(){
    taskList.innerHTML="";

    let filteredTasks=tasks;
    if (currentFilter === "active"){
      filteredTasks=tasks.filter((task) => !task.completed);
    } 
    else if(currentFilter === "completed"){
      filteredTasks=tasks.filter((task) => task.completed);
    }

    if (filteredTasks.length === 0){
      taskList.innerHTML="<p>No tasks yet. Add one above!</p>";
      updateCount();
      return;
    }
    filteredTasks.forEach((task) =>{
      const taskElement=document.createElement("div");
      taskElement.className=`task ${task.completed ? "completed" : ""}`;
      taskElement.dataset.id=task.id;
      taskElement.innerHTML=`<input type="checkbox" ${task.completed ? "checked" : ""} class="task-checkbox">
                <div class="task-content">
                    <h3 class="task-title">${task.title}</h3>
                    ${
                      task.description
                        ? `<p class="task-description">${task.description}</p>`
                        : ""
                    }
                </div>
                <div class="task-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
      taskList.appendChild(taskElement);
    });

    document.querySelectorAll('.task input[type="checkbox"]').forEach((checkbox) =>{
        checkbox.addEventListener("change", toggleComplete);
      });

    document.querySelectorAll(".delete-btn").forEach((btn) =>{
      btn.addEventListener("click", deleteTask);
    });

    document.querySelectorAll(".edit-btn").forEach((btn) =>{
      btn.addEventListener("click", enableInlineEdit);
    });
    updateCount();
  }

  function toggleComplete(e){
    const taskId=parseInt(e.target.closest(".task").dataset.id);
    const task=tasks.find((t) => t.id === taskId);
    task.completed=!task.completed;
    saveTasks();
    showTasks();
  }

  function deleteTask(e){
    if (confirm("Are you sure you want to delete this task?")) {
      const taskId=parseInt(e.target.closest(".task").dataset.id);
      tasks=tasks.filter((task) =>task.id !== taskId);
      saveTasks();
      showTasks();
    }
  }
  function enableInlineEdit(e){
    const taskEl=e.target.closest(".task");
    const taskId=parseInt(taskEl.dataset.id);
    const task=tasks.find((t) => t.id === taskId);

    const contentDiv=taskEl.querySelector(".task-content");
    contentDiv.innerHTML=`<input type="text" class="edit-title" value="${task.title}">
            <textarea class="edit-description">${task.description || ""}</textarea>
            <div class="edit-form-actions">
                <button class="save-btn">Save</button>
                <button class="cancel-btn">Cancel</button>
            </div>
        `;
    contentDiv.querySelector(".save-btn").addEventListener("click", () =>{
      const newTitle=contentDiv.querySelector(".edit-title").value.trim();
      const newDesc=contentDiv.querySelector(".edit-description").value.trim();

      if (newTitle === ""){
        alert("Task title cannot be empty!");
        return;
      }
      task.title=newTitle;
      task.description=newDesc;
      saveTasks();
      showTasks();
    });

    contentDiv.querySelector(".cancel-btn").addEventListener("click", () => {
      showTasks();
    });
  }

  function clearDoneTasks(){
    if (confirm("Clear all completed tasks?")){
      tasks=tasks.filter((task) => !task.completed);
      saveTasks();
      showTasks();
    }
  }
  function updateCount(){
    const total=tasks.length;
    const remaining=tasks.filter((task) => !task.completed).length;
    countDisplay.textContent=`${remaining} tasks remaining (${total} total)`;
  }
  function saveTasks(){
    localStorage.setItem("myTasks",JSON.stringify(tasks));
  }
});
