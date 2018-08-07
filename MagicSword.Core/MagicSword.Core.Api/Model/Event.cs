namespace MagicSword.Core.Api.Model
{
    public class Event
    {
        public int GameId { get; set; }

        public string EventType { get; set; }

        public object Data { get; set; }
    }
}