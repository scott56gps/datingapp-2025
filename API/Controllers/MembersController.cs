using System.Security.Claims;
using Api.Controllers;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    // HERE is where the AppDbContext is injected into the MembersController, instantiating it
    [Authorize]
    public class MembersController(
        IMemberRepository memberRepository,
        IPhotoService photoService) : BaseApiController
    {
        [HttpGet]
        // An ActionResult is analagous to HttpResponse in Spring
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            // An IReadOnlyList is simply an indexable list.  It is not modifiable.
            // Await *delegates* contacting the database to another thread, freeing up this thread
            return Ok(await memberRepository.GetMembersAsync());
        }

        [HttpGet("{id}")] // localhost:5001/api/members/bob-id
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var member = await memberRepository.GetMemberByIdAsync(id);
            if (member == null) return NotFound();
            return Ok(member);
        }

        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
        {
            return Ok(await memberRepository.GetPhotosForMemberAsync(id));
        }

        // There is no point in returning something for an update request.  The client is aware of what they are updating
        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            var memberId = User.GetMemberId();  // We get the currently logged-in user's memberId.  A User Claim object 'Claims' the only token we have issued for this user.
            var member = await memberRepository.GetMemberForUpdate(memberId);
            if (member == null) return BadRequest("Could not get member");

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;

            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;

            memberRepository.Update(member); // optional

            if (await memberRepository.SaveAllAsync()) return NoContent(); // Successful save

            return BadRequest("Failed to update member");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());
            if (member == null) return BadRequest("Cannot update member");

            var result = await photoService.UploadPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.GetMemberId()
            };

            // If the member does not have an image associated with it
            if (member.ImageUrl == null)
            {
                member.ImageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;
            }

            member.Photos.Add(photo);

            if (await memberRepository.SaveAllAsync()) return photo;

            return BadRequest("Problem adding photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());
            if (member == null) return BadRequest("cannot get member from token");

            var photo = member.Photos.SingleOrDefault((x) => x.Id == photoId);
            if (photo == null || photo.Url == member.ImageUrl)
            {
                // We cannot delete the member's currently set image url
                return BadRequest("This photo cannot be deleted");
            }

            if (photo.PublicId != null)
            {
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);

            }

            member.Photos.Remove(photo);
            
            if (await memberRepository.SaveAllAsync()) return Ok();
            return BadRequest("Problem deleting photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());
            if (member == null) return BadRequest("Cannot get member from token");

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if (member.ImageUrl == photo?.Url || photo == null)
            {
                return BadRequest("Cannot set this image as the main image");
            }

            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;

            if (await memberRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Problem setting main photo");
        }
    }
}
