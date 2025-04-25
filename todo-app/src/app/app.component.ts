import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

// tipo que representa uma tarefa
interface Todo {
  id: number;
  title: string;
  dueDate: string;
  priority: "Baixa" | "Média" | "Alta";
  isCompleted: boolean;
}

// guarda quais prioridades estão selecionadas no filtro
type PrioritySelection = {
  [key: string]: boolean;
};

// define como as tarefas podem ser ordenadas
type SortCriteria = "date" | "priority";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  // url da api e ordem das prioridades
  private readonly API_URL = "http://localhost:5206/api/todoitems";
  private readonly PRIORITY_ORDER: Record<string, number> = {
    Alta: 1,
    Média: 2,
    Baixa: 3
  };

  // propriedades principais
  title = "todo-app";
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];

  // campos para criar uma nova tarefa
  newTodoTitle = "";
  newTodoDueDate = "";
  newTodoPriority: "Baixa" | "Média" | "Alta" = "Baixa";

  // campos para editar uma tarefa existente
  editingTodoId: number | null = null;
  editedTitle = "";
  editedDueDate = "";
  editedPriority: "Baixa" | "Média" | "Alta" = "Baixa";

  // configurações de filtro e ordenação
  sortCriteria: SortCriteria = "date";
  searchTerm = "";
  selectedPriorities: PrioritySelection = {
    "Baixa": true,
    "Média": true,
    "Alta": true
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  /**
   * busca todas as tarefas da api
   */
  loadTodos(): void {
    this.http.get<Todo[]>(this.API_URL).subscribe({
      next: (todos) => {
        this.todos = todos;
        this.applyFilter();
      },
      error: (error: HttpErrorResponse) => {
        console.error("Erro ao carregar tarefas", error);
      }
    });
  }

  /**
   * verifica se tem alguma tarefa concluída
   */
  hasCompletedTasks(): boolean {
    return this.todos.some(todo => todo.isCompleted);
  }

  /**
   * filtra as tarefas por texto e prioridade
   */
  applyFilter(): void {
    // filtra pelo texto digitado
    let filtered = this.todos;
    const term = this.searchTerm.trim().toLowerCase();

    if (term) {
      filtered = filtered.filter((todo) =>
        todo.title.toLowerCase().includes(term)
      );
    }

    // filtra pelas prioridades marcadas
    filtered = filtered.filter(todo =>
      this.selectedPriorities[todo.priority]
    );

    this.filteredTodos = filtered;
    this.applySort();
  }

  /**
   * liga/desliga um filtro de prioridade
   */
  togglePriorityFilter(priority: string): void {
    this.selectedPriorities[priority] = !this.selectedPriorities[priority];
    this.applyFilter();
  }

  /**
   * ordena as tarefas por data ou prioridade
   */
  applySort(): void {
    if (this.sortCriteria === "date") {
      this.filteredTodos.sort(
        (a, b) => new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime()
      );
    } else if (this.sortCriteria === "priority") {
      this.filteredTodos.sort(
        (a, b) => this.PRIORITY_ORDER[a.priority] - this.PRIORITY_ORDER[b.priority]
      );
    }
  }

  /**
   * cria uma nova tarefa
   */
  addTodo(): void {
    if (!this.newTodoTitle.trim()) return;

    const newTodo = {
      title: this.newTodoTitle,
      dueDate: this.newTodoDueDate,
      priority: this.newTodoPriority,
      isCompleted: false
    };

    this.http.post<Todo>(this.API_URL, newTodo).subscribe({
      next: () => {
        this.resetNewTodoForm();
        this.loadTodos();
      },
      error: (error: HttpErrorResponse) => {
        console.error("Erro ao adicionar tarefa", error);
      }
    });
  }

  /**
   * limpa o formulário de nova tarefa
   */
  private resetNewTodoForm(): void {
    this.newTodoTitle = "";
    this.newTodoDueDate = "";
    this.newTodoPriority = "Baixa";
  }

  /**
   * marca/desmarca uma tarefa como concluída
   */
  toggleTodo(todo: Todo): void {
    const updatedTodo = {
      ...todo,
      isCompleted: !todo.isCompleted
    };

    this.http.put(`${this.API_URL}/${todo.id}`, updatedTodo).subscribe({
      next: () => this.loadTodos(),
      error: (error: HttpErrorResponse) => {
        console.error("Erro ao alternar estado da tarefa", error);
      }
    });
  }

  /**
   * apaga uma tarefa
   */
  deleteTodo(id: number): void {
    this.http.delete(`${this.API_URL}/${id}`).subscribe({
      next: () => this.loadTodos(),
      error: (error: HttpErrorResponse) => {
        console.error("Erro ao excluir tarefa", error);
      }
    });
  }

  /**
   * prepara uma tarefa para edição
   */
  editTodo(todo: Todo): void {
    this.editingTodoId = todo.id;
    this.editedTitle = todo.title;
    this.editedDueDate = todo.dueDate || "";
    this.editedPriority = todo.priority;
  }

  /**
   * salva as alterações de uma tarefa
   */
  saveEdit(todo: Todo): void {
    if (!this.editedTitle.trim()) return;

    const updatedTodo = {
      ...todo,
      title: this.editedTitle,
      dueDate: this.editedDueDate,
      priority: this.editedPriority,
    };

    this.http.put(`${this.API_URL}/${todo.id}`, updatedTodo).subscribe({
      next: () => {
        this.editingTodoId = null;
        this.loadTodos();
      },
      error: (error: HttpErrorResponse) => {
        console.error("Erro ao atualizar tarefa", error);
      }
    });
  }

  /**
   * cancela a edição de uma tarefa
   */
  cancelEdit(): void {
    this.editingTodoId = null;
  }

  /**
   * remove todas as tarefas já concluídas
   */
  removeCompleted(): void {
    this.http.delete(`${this.API_URL}/completed`).subscribe({
      next: () => {
        this.loadTodos();
      },
      error: (error: HttpErrorResponse) => {
        console.error("Erro ao remover tarefas concluídas", error);
      }
    });
  }
}
