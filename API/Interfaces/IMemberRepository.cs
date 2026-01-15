using API.Entities;

namespace API.Interfaces;

public interface IMemberRepository
{
    void Update(Member member);
    Task<bool> SaveAllAsync();
    Task<PaginatedResult<Member>> GetMembersAsync(PagingParams pagingParams);
    Task<IReadOnlyList<Member>> GetMembersAsync();
    Task<Member?> GetMemberByIdAsync(string id);
    Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId);
    Task<Member?> GetMemberForUpdate(string id);
}
