using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MagicSword.Core.Api.Model;
using Microsoft.AspNetCore.SignalR;

namespace MagicSword.Core.Api.Hubs
{
    public class GameHub : Hub
    {
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


    }
}
