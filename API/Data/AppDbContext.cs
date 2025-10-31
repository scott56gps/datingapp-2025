using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    // This DbSet represents the Users table in the database
    public DbSet<AppUser> Users { get; set; }
}
