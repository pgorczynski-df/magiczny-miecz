using Microsoft.AspNetCore.SignalR;

namespace MagicSword.Core.Api.Security
{
    public class NameUserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            return connection.User?.Identity?.Name;
        }
    }
}
