import { Component, OnInit } from '@angular/core';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  editing?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  newTaskTitle: string = '';
  filter: 'all' | 'completed' | 'incomplete' = 'all';
  searchTerm: string = '';

  ngOnInit() {
    this.loadTasks();
    this.applyFilter();
  }

  addTask() {
    if (this.newTaskTitle.trim()) {
      const newTask: Task = { id: Date.now(), title: this.newTaskTitle.trim(), completed: false };
      this.tasks.push(newTask);
      this.newTaskTitle = '';
      this.saveTasks();
      this.applyFilter();
    }
  }

  toggleTaskCompletion(task: Task, event: any) {
    task.completed = event?.checked;
    this.tasks.forEach(t => {
      if (t.id === task.id) {
        t.completed = task.completed;
      }
    });
    this.saveTasks();
    this.applyFilter();
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.saveTasks();
    this.applyFilter();
  }

  applyFilter() {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesFilter = this.filter === 'all' || 
        (this.filter === 'completed' && task.completed) || 
        (this.filter === 'incomplete' && !task.completed);
      const matchesSearch = task.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }

  loadTasks() {
    const tasksJson = localStorage.getItem('tasks');
    this.tasks = tasksJson ? JSON.parse(tasksJson) : [];
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  setFilter(filter: 'all' | 'completed' | 'incomplete') {
    this.filter = filter;
    this.applyFilter();
  }

  editTask(task: Task) {
    task.editing = true;
  }

  updateTask(task: Task, newTitle: string) {
    if (newTitle.trim()) {
      task.title = newTitle.trim();
      task.editing = false;
      this.saveTasks();
      this.applyFilter();
    }
  }

  cancelEdit(task: Task) {
    task.editing = false;
  }
}
