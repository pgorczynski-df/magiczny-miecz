using System;
using System.Collections.Generic;
using System.Linq;

namespace MagicSword.Core.Api.Model
{
    public class Game : Entity
    {
        public int OwnerId { get; set; }

        public Player Owner { get; set; }

        public List<GamePlayer> Participants { get; set; } = new List<GamePlayer>();

        public string Data { get; set; }

        public bool IsParticipant(int playerId)
        {
            if (!Participants.Any())
            {
                throw new InvalidOperationException("Game has no participants, is the collection loaded properly?");
            }

            return Participants.Any(p => p.PlayerId == playerId);
        }
    }
}