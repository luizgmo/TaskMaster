using System;
using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models
{
    /// <summary>
    /// representa uma tarefa na lista
    /// </summary>
    public class TodoItem
    {
        /// <summary>
        /// número único da tarefa
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// nome da tarefa
        /// </summary>
        [Required(ErrorMessage = "precisa de um título")]
        [StringLength(100, ErrorMessage = "título muito grande, máximo 100 letras")]
        public required string Title { get; set; }

        /// <summary>
        /// data limite para completar
        /// </summary>
        [Required(ErrorMessage = "precisa de uma data")]
        public DateTime? DueDate { get; set; }

        /// <summary>
        /// importância da tarefa
        /// </summary>
        [Required(ErrorMessage = "precisa de uma prioridade")]
        [RegularExpression("^(Baixa|Média|Alta)$", 
            ErrorMessage = "prioridade deve ser 'Baixa', 'Média' ou 'Alta'")]
        public required string Priority { get; set; }

        /// <summary>
        /// mostra se já foi feita
        /// </summary>
        public bool IsCompleted { get; set; }
    }
}