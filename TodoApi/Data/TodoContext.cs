using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models
{
    /// <summary>
    /// conecta com o banco de dados das tarefas
    /// </summary>
    public class TodoContext : DbContext
    {
        /// <summary>
        /// cria uma nova conexão
        /// </summary>
        /// <param name="options">configurações da conexão</param>
        public TodoContext(DbContextOptions<TodoContext> options)
            : base(options) { }

        /// <summary>
        /// lista de tarefas no banco
        /// </summary>
        public DbSet<TodoItem> TodoItems => Set<TodoItem>();

        /// <summary>
        /// configura as regras do banco
        /// </summary>
        /// <param name="modelBuilder">ferramenta de configuração</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<TodoItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired();
                entity.Property(e => e.DueDate).IsRequired();
                entity.Property(e => e.Priority).IsRequired();
            });
        }
    }
}