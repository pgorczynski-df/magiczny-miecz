namespace MagicSword.Core.Api.Model
{
    public class Event
    {
        public int SourcePlayerId { get; set; }

        public int GameId { get; set; }

        public string EventType { get; set; }

        public object Data { get; set; }

        public string Token { get; set; }
    }
}