using API.Helpers;

public class LikesParams: PagingParams
{
    public string? Predicate { get; set; }
    public string? MemberId { get; set; }
}
