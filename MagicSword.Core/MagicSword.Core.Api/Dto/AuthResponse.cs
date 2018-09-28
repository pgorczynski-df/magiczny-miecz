
namespace MagicSword.Core.Api.Dto
{
    public class AuthResponse
    {
        public bool Success { get; set; }

        public UserDto User { get; set; }

        public string Error { get; set; }
    }
}
