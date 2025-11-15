const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const prioritySelect = document.getElementById("prioritySelect");
const taskList = document.getElementById("taskList");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

let totalTasks = 0;
let completedTasks = 0;

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = taskInput.value.trim();
  const date = dueDate.value;
  const priority = prioritySelect.value;

  if (text === "" || date === "") return;

  createTask(text, date, priority);

  taskInput.value = "";
  dueDate.value = "";
});

function createTask(text, date, priority) {
  totalTasks++;

  const li = document.createElement("li");
  li.classList.add(priority);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("task-check");

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      li.classList.add("completed");
      completedTasks++;
      launchConfetti();
    } else {
      li.classList.remove("completed");
      completedTasks--;
    }
    updateProgress();
  });

  const taskContent = document.createElement("div");
  taskContent.classList.add("task-content");
  taskContent.innerHTML = `
    <span>${text}</span>
    <span class="due-date">Due: ${formatDate(date)}</span>
  `;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "✕";

  deleteBtn.addEventListener("click", () => {
    li.style.animation = "fadeOut 0.4s forwards";
    setTimeout(() => {
      li.remove();
      if (checkbox.checked) completedTasks--;
      totalTasks--;
      updateProgress();
    }, 350);
  });

  li.appendChild(checkbox);
  li.appendChild(taskContent);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  updateProgress();
}

function formatDate(str) {
  return new Date(str).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function updateProgress() {
  const percent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  progressFill.style.width = percent + "%";
  progressText.textContent = percent + "% Completed";
}

/* ---------- CONFETTI EFFECT ---------- */
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function launchConfetti() {
  for (let i = 0; i < 150; i++) {
    confettiPieces.push(new Confetti());
  }
}

let confettiPieces = [];

class Confetti {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = -20;
    this.size = Math.random() * 6 + 4;
    this.speed = Math.random() * 3 + 2;
    this.color = `hsl(${Math.random() * 360}, 90%, 60%)`;
  }
  update() {
    this.y += this.speed;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confettiPieces.forEach((c, i) => {
    c.update();
    c.draw();
    if (c.y > canvas.height) confettiPieces.splice(i, 1);
  });
  requestAnimationFrame(animate);
}
animate();
