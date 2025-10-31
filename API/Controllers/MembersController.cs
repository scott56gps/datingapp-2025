using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")] // localhost:5001/api/members
    [ApiController]
    // HERE is where the AppDbContext is injected into the MembersController, instantiating it
    public class MembersController(AppDbContext context) : ControllerBase
    {
        [HttpGet]
        // An ActionResult is analagous to HttpResponse in Spring
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMembers()
        {
            // An IReadOnlyList is simply an indexable list.  It is not modifiable.
            // Await *delegates* contacting the database to another thread, freeing up this thread
            var members = await context.Users.ToListAsync();

            return members;
        }

        [HttpGet("{id}")] // localhost:5001/api/members/bob-id
        public async Task<ActionResult<AppUser>> GetMember(string id)
        {
            var user = await context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }
    }
}
