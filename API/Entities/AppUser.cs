// A logical representation of where this class is
namespace API.Entities;

// An entity describes a row in a database table
// Each property in the entity maps to a column in that table
public class AppUser
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string DisplayName { get; set; }
    public required string Email { get; set; }
    public string? ImageUrl { get; set; }
    public required byte[] PasswordHash { get; set;  }
    public required byte[] PasswordSalt { get; set; }

    // Navigation property
    public Member Member { get; set; } = null!;
}
