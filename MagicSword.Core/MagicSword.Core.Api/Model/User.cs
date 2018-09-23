using Microsoft.AspNetCore.Identity;

namespace MagicSword.Core.Api.Model
{
    public class User : IdentityUser<int>
    {
        public string Nickname { get; set; }
    }
}
