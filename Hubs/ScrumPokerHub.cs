using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;

namespace signalr_scrumpoker.Hubs
{
    public class ScrumPokerHub : Hub
    {
        /// <summary>
        /// Send a message to all clients
        /// </summary>
        /// <param name="user"></param>
        /// <param name="message"></param>
        /// <param name="argument"></param>
        /// <returns></returns>
        public async Task BroadcastMessage(string user, string message, string argument)
            => await Clients.All.SendAsync("broadcastMessage", user, message, argument);

        /// <summary>
        /// Send back a message to caller
        /// </summary>
        /// <param name="user"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task Echo(string user, string message)
            => await Clients.Caller.SendAsync("echo", user, message);

        /// <summary>
        /// Perform vote operations
        /// </summary>
        /// <param name="user"></param>
        /// <param name="message">start, end, or another value treated as a vote</param>
        /// <returns></returns>
        public async Task Vote(string user, string message)
            => await Clients.All.SendAsync("vote", user, message);

        public async override Task OnDisconnectedAsync(Exception? exception)
        {
            await Clients.All.SendAsync("broadcastMessage", "_SYSTEM_", "A user has disconnected", null);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
