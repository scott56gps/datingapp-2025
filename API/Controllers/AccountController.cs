using System.Security.Cryptography;
using System.Text;
using Api.Controllers;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(AppDbContext context, ITokenService tokenService) : BaseApiController
{
    // With the parameters here, we expect a Query String with those parameter names
    [HttpPost("register")] // api/account/register
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        // We use await because a Task is returned from the EmailExisits method
        if (await EmailExists(registerDto.Email)) return BadRequest("Email taken");
        using var hmac = new HMACSHA512(); // 'using' ensures that we properly dispose of the variable when no longer needed

        var user = new AppUser
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
            PasswordSalt = hmac.Key
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return user.ToDto(tokenService);
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await context.Users.SingleOrDefaultAsync(user => user.Email == loginDto.Email);

        if (user == null) return Unauthorized("Invalid email address");

        // Use HMAC to compare passwords
        // We pass the salt, so we get the correct password back
        using var hmac = new HMACSHA512(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for (var i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
        }

        return user.ToDto(tokenService);
    }

    private async Task<bool> EmailExists(string email)
    {
        return await context.Users.AnyAsync(user => user.Email.ToLower() == email.ToLower());
    }
}
