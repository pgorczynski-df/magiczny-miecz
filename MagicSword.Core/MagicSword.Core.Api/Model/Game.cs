using System.Collections.Generic;

namespace MagicSword.Core.Api.Model
{
    public class Game : Entity
    {
        public int OwnerId { get; set; }

        public Player Owner { get; set; }

        public List<GamePlayer> Participants { get; set; } = new List<GamePlayer>();

        public string Data { get; set; }
    }
}