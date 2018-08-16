
namespace MagicSword.Core.Api.Model
{
    public class EventType : IEnum
    {
        public const string JoinGameRequest = "JoinGameRequest";

        public const string JoinGameResponse = "JoinGameResponse";

        public const string ResetGameState = "ResetGameState";

        public const string PlayerJoined = "PlayerJoined";

        public const string GameLoadRequest = "GameLoadRequest";

        public const string GameLoadResponse = "GameLoadResponse";

        public const string ActorMove = "ActorMove";

        public const string ActorRotate = "ActorRotate";

        public const string CardDrawn = "CardDrawn";
    }
}
