import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Todo {
  id: number;
  title: string;
  dueDate: string;
  priority: 'Baixa' | 'Média' | 'Alta';
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

  newTodoTitle = '';
  newTodoDueDate = '';
  newTodoPriority: 'Baixa' | 'Média' | 'Alta' = 'Baixa';

  editingTodoId: number | null = null;
  editedTitle = '';
  editedDueDate = '';
  editedPriority: 'Baixa' | 'Média' | 'Alta' = 'Baixa';

  constructor(private http: HttpClient) {
    this.loadTodos();
  }

  loadTodos() {
    this.http.get<Todo[]>('http://localhost:5206/api/todoitems')
      .subscribe(todos => this.todos = todos);
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) return;

    this.http.post<Todo>('http://localhost:5206/api/todoitems', {
      title: this.newTodoTitle,
      dueDate: this.newTodoDueDate,
      priority: this.newTodoPriority,
      isCompleted: false
    }).subscribe(() => {
      this.newTodoTitle = '';
      this.newTodoDueDate = '';
      this.newTodoPriority = 'Baixa';
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

  editTodo(todo: Todo) {
    this.editingTodoId = todo.id;
    this.editedTitle = todo.title;
    this.editedDueDate = todo.dueDate || '';
    this.editedPriority = todo.priority;
  }

  saveEdit(todo: Todo) {
    if (!this.editedTitle.trim()) return;

    const updatedTodo = {
      ...todo,
      title: this.editedTitle,
      dueDate: this.editedDueDate,
      priority: this.editedPriority
    };

    this.http.put(`http://localhost:5206/api/todoitems/${todo.id}`, updatedTodo)
      .subscribe(() => {
        this.editingTodoId = null;
        this.loadTodos();
      }, error => {
        console.error('Erro ao atualizar tarefa', error);
      });
  }

  cancelEdit() {
    this.editingTodoId = null;
  }
}
