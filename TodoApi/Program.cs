using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

// cria o app
var builder = WebApplication.CreateBuilder(args);

// configura o banco na memória
builder.Services.AddDbContext<TodoContext>(opt => 
    opt.UseInMemoryDatabase("TodoList"));

// permite que o frontend acesse a api
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()  // qualquer site pode usar
              .AllowAnyMethod()  // permite todos os métodos (get, post, etc)
              .AllowAnyHeader(); // permite todos os cabeçalhos
    });
});

// adiciona os controladores
builder.Services.AddControllers();

// monta o app
var app = builder.Build();

// ativa o cors
app.UseCors("AllowAll");

// configura as rotas
app.MapControllers();

// inicia o servidor
app.Run();