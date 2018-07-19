using System;
using System.Threading.Tasks;
using MagicSword.Core.Api.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MagicSword.Core.Api.Hubs
{
    public class GameHub : Hub
    {
        [Authorize]
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task Publish(Event @event)
        {
            //switch (@event.Type)
            //{
                    
            //}

            await Clients.Others.SendAsync("NewEvent", @event);
        }

        //public override async Task OnConnectedAsync()
        //{
        //    await Clients.All.SendAsync("ReceiveSystemMessage", $"{Context.UserIdentifier} joined.");
        //    await base.OnConnectedAsync();
        //}

        //public override async Task OnDisconnectedAsync(Exception exception)
        //{
        //    await Clients.All.SendAsync("ReceiveSystemMessage", $"{Context.UserIdentifier} left.");
        //    await base.OnDisconnectedAsync(exception);
        //}
    }
}
