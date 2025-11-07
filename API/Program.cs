using System.Text;
using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// These are available for dependency injection throughout the application
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    // Here: we get the connection string from the configuration, like in Java Spring
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var tokenKey = builder.Configuration["TokenKey"] ?? throw new Exception("Token key not found -- Program.cs");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),

            // Just for development:
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

var app = builder.Build();

// Now we can configure the services/middleware pipeline
app.UseCors(policy => policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins("http://localhost:4200")
            .WithOrigins("https://localhost:4200"));
app.UseAuthentication(); // Who are you?
app.UseAuthorization();  // What can you do?  We need to know who you are first

app.MapControllers();
app.Run();
