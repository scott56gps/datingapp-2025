using API.Entities;

namespace API.Interfaces;

public interface ILikesRepository
{
    Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId);
    // Generic function that will retrieve likes based on a predicate (either likes this member has for others, or likes others have for this member)
    Task<IReadOnlyList<Member>> GetMemberLikes(string predicate, string memberId);
    Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId);
    void CreateMemberLike(MemberLike like);
    void DeleteMemberLike(MemberLike like);
    Task<bool> SaveAllChanges();
}
