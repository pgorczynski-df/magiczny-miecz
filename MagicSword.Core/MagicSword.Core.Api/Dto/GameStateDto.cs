namespace MagicSword.Core.Api.Dto
{
    public class GameStateDto : IDto
    {
        public bool IsStarted { get; set; }

        public string Data { get; set; }
    }
}
