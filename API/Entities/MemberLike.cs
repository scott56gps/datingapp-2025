namespace API.Entities;

/**
   An entity that models the relationship state of a Member liking another
   Member.
 */
public class MemberLike
{
    public required string SourceMemberId { get; set; }
    public Member SourceMember { get; set; } = null!;
    public required string TargetMemberId { get; set; }
    public Member TargetMember { get; set; } = null!;
}
