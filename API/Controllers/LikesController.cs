using Api.Controllers;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController(ILikesRepository likesRepository) : BaseApiController
{
    [HttpPost("{targetMemberId}")]
    public async Task<ActionResult> AddLike(
        string targetMemberId
    )
    {
        var currentMemberId = User.GetMemberId();

        if (currentMemberId == targetMemberId) return BadRequest("A Member cannot like itself");

        var like = new MemberLike
        {
            SourceMemberId = currentMemberId,
            TargetMemberId = targetMemberId
        };

        likesRepository.CreateMemberLike(like);

        if (await likesRepository.SaveAllChanges()) return Ok();

        return BadRequest("Failed to create like");
    }

    [HttpDelete("{targetMemberId}")]
    public async Task<ActionResult> DeleteLike(
        string targetMemberId
    )
    {
        var currentMemberId = User.GetMemberId();

        var existingLike = await likesRepository.GetMemberLike(currentMemberId, targetMemberId);

        if (existingLike != null)
        {
            likesRepository.DeleteMemberLike(existingLike);
            if (!await likesRepository.SaveAllChanges())
                return BadRequest("Failed to delete like");
        }
        return NoContent();
    }

    [HttpGet("like-ids")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetLikesForMember()
    {
        return Ok(
            await likesRepository.GetCurrentMemberLikeIds(User.GetMemberId())
        );
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMemberLikes(string predicate)
    {
        var members = await likesRepository.GetMemberLikes(predicate, User.GetMemberId());

        return Ok(members);
    }
}
