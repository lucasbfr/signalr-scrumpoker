using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;

namespace signalr_scrumpoker.Hubs
{
    public class ScrumPokerHub : Hub
    {
        public async Task BroadcastMessage(string user, string message, string argument)
            => await Clients.All.SendAsync("broadcastMessage", user, message, argument);

        public async Task Echo(string user, string message)
            => await Clients.Caller.SendAsync("echo", user, message);

        public async Task Vote(string user, string message)
            => await Clients.All.SendAsync("vote", user, message);

        public async override Task OnDisconnectedAsync(Exception? exception)
        {
            await Clients.All.SendAsync("broadcastMessage", "_SYSTEM_", "A user has disconnected", null);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
