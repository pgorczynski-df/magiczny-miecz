using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace MagicSword.Core.Api.Model
{
    // Add profile data for application users by adding properties to the MagicSwordCoreApiUser class
    public class Player : IdentityUser<int>
    {
        public List<GamePlayer> ParticipatedGames { get; set; } = new List<GamePlayer>();
    }
}
