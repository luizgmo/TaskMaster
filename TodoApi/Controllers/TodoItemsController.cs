using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TodoApi.Models;

namespace TodoApi.Controllers
{
    /// <summary>
    /// controla as operações das tarefas
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class TodoItemsController : ControllerBase
    {
        private readonly TodoContext _context;

        /// <summary>
        /// cria um novo controlador
        /// </summary>
        /// <param name="context">o banco de dados das tarefas</param>
        public TodoItemsController(TodoContext context)
        {
            _context = context;
        }

        /// <summary>
        /// pega todas as tarefas
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItems()
        {
            return await _context.TodoItems.ToListAsync();
        }

        /// <summary>
        /// cria uma nova tarefa
        /// </summary>
        /// <param name="todoItem">dados da tarefa</param>
        [HttpPost]
        public async Task<ActionResult<TodoItem>> PostTodoItem(TodoItem todoItem)
        {
            // checa se os dados são válidos
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.TodoItems.Add(todoItem);
            await _context.SaveChangesAsync();
            
            return CreatedAtAction(nameof(GetTodoItems), new { id = todoItem.Id }, todoItem);
        }

        /// <summary>
        /// atualiza uma tarefa existente
        /// </summary>
        /// <param name="id">número da tarefa</param>
        /// <param name="todoItem">novos dados da tarefa</param>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoItem(int id, TodoItem todoItem)
        {
            // checa se o id está correto
            if (id != todoItem.Id) 
            {
                return BadRequest("o id na url não bate com o id da tarefa");
            }

            // checa se os dados são válidos
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            _context.Entry(todoItem).State = EntityState.Modified;
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // checa se a tarefa existe
                if (!TodoItemExists(id))
                {
                    return NotFound($"não achei a tarefa {id}");
                }
                throw;
            }
            
            return NoContent();
        }

        /// <summary>
        /// apaga uma tarefa
        /// </summary>
        /// <param name="id">número da tarefa</param>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(int id)
        {
            var todo = await _context.TodoItems.FindAsync(id);
            
            if (todo == null) 
            {
                return NotFound($"não achei a tarefa {id}");
            }
            
            _context.TodoItems.Remove(todo);
            await _context.SaveChangesAsync();
            
            return NoContent();
        }

        /// <summary>
        /// apaga todas as tarefas já concluídas
        /// </summary>
        [HttpDelete("completed")]
        public async Task<IActionResult> DeleteCompletedTodoItems()
        {
            var completedTodos = await _context.TodoItems
                .Where(t => t.IsCompleted)
                .ToListAsync();

            if (completedTodos.Count == 0)
            {
                return NoContent();
            }

            _context.TodoItems.RemoveRange(completedTodos);
            await _context.SaveChangesAsync();
            
            return NoContent();
        }

        /// <summary>
        /// checa se uma tarefa existe
        /// </summary>
        /// <param name="id">número da tarefa</param>
        private bool TodoItemExists(int id)
        {
            return _context.TodoItems.Any(e => e.Id == id);
        }
    }
}