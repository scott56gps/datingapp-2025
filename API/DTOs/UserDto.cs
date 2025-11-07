namespace API.DTOs;

public class UserDto
{
    // These are required because *we can ensure that they will be there*
    //  *there is an assured model object backing this DTO*
    //  This DTO is not the start of information.  It is an intermediary used
    //  to facilitate data transfers between the REAL holder of data (the model)
    public required string Id { get; set; }
    public required string Email { get; set; }
    public required string DisplayName { get; set; }
    public required string Token { get; set; }
    public string? ImageUrl { get; set; }
}
