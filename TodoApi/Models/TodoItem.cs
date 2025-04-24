using System;
using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models
{
    public class TodoItem
    {
        public int Id { get; set; }

        [Required]
        public required string Title { get; set; }

        public DateTime? DueDate { get; set; }

        [Required]
        public required string Priority { get; set; }

        public bool IsCompleted { get; set; }
    }
}
