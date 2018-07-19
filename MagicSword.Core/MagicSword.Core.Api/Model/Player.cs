
using System.Collections.Generic;

namespace MagicSword.Core.Api.Model
{
    public class Player : Entity
    {
        public string Email { get; set; }

        public string Nickname { get; set; }

        public List<GamePlayer> ParticipatedGames { get; set; } = new List<GamePlayer>();
    }
}
