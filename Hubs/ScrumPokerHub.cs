using Microsoft.AspNetCore.SignalR;

namespace signalr_scrumpoker.Hubs
{
    public class ScrumPokerHub : Hub
    {
        public async Task BroadcastMessage(string user, string message)
            => await Clients.All.SendAsync("broadcastMessage", user, message);

        public async Task Echo(string user, string message)
            => await Clients.Caller.SendAsync("echo", user, message);

    }
}
