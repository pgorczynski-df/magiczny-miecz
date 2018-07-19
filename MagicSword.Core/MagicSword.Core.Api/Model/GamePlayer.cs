namespace MagicSword.Core.Api.Model
{
    public class GamePlayer
    {
        public int GameId { get; set; }

        public Game Game { get; set; }

        public int PlayerId { get; set; }

        public Player Player { get; set; }
    }
}
