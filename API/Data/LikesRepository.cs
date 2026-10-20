using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikesRepository(AppDbContext context) : ILikesRepository
{
    public void CreateMemberLike(MemberLike like)
    {
        context.Likes.Add(like);
    }

    public void DeleteMemberLike(MemberLike like)
    {
        context.Likes.Remove(like);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
    {
        return await context.Likes
            .Where(l => l.SourceMemberId == memberId) // This filters down to the entity we're looking for
            .Select(l => l.TargetMemberId) // This specifies the column we're looking for
            .ToListAsync();
    }

    public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
    {
        return await context.Likes.FindAsync(sourceMemberId, targetMemberId);
    }

    public async Task<IReadOnlyList<Member>> GetMemberLikes(string predicate, string memberId)
    {
        var query = context.Likes.AsQueryable();

        switch (predicate)
        {
            case "liked":
                return await query
                    .Where(l => l.SourceMemberId == memberId)
                    .Select(l => l.TargetMember)
                    .ToListAsync();
            case "likedBy":
                return await query
                    .Where(l => l.TargetMemberId == memberId)
                    .Select(l => l.SourceMember)
                    .ToListAsync();
            default:
                var likeIds = await GetCurrentMemberLikeIds(memberId);
                return await query
                    .Where(l => l.TargetMemberId == memberId
                           && likeIds.Contains(l.SourceMemberId))
                    .Select(l => l.SourceMember)
                    .ToListAsync();
        }
    }

    public async Task<bool> SaveAllChanges()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
