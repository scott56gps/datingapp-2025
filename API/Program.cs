using API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// These are available for dependency injection throughout the application
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    // Here: we get the connection string from the configuration, like in Java Spring
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();

app.MapControllers();
app.Run();
