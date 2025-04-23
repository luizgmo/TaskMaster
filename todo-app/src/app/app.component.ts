import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'todo-app';
  todos: Todo[] = [];
  newTodo = '';

  constructor(private http: HttpClient) {
    this.loadTodos();
  }

  loadTodos() {
    this.http.get<Todo[]>('http://localhost:5206/api/todoitems')
      .subscribe(todos => this.todos = todos);
  }

  addTodo() {
    if (!this.newTodo.trim()) return;

    this.http.post<Todo>('http://localhost:5206/api/todoitems', {
      title: this.newTodo,
      isCompleted: false
    }).subscribe(() => {
      this.newTodo = '';
      this.loadTodos();
    });
  }

  toggleTodo(todo: Todo) {
    this.http.put(`http://localhost:5206/api/todoitems/${todo.id}`, {
      ...todo,
      isCompleted: !todo.isCompleted
    }).subscribe(() => this.loadTodos());
  }

  deleteTodo(id: number) {
    this.http.delete(`http://localhost:5206/api/todoitems/${id}`)
      .subscribe(() => this.loadTodos());
  }
}
