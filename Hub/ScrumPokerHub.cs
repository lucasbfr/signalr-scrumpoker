using Microsoft.AspNetCore.SignalR;

namespace signalr_scrumpoker.Hub
{
    public class ScrumPokerHub : Hub<IScrumPokerClient>
    {
        public async Task SendMessage(string user, ScrumPokerMessage message)
            => await Clients.All.ReceiveMessage(user, message);

        public async Task SendMessageToCaller(string user, ScrumPokerMessage message)
            => await Clients.Caller.ReceiveMessage(user, message);

        public async Task SendMessageToGroup(string user, ScrumPokerMessage message)
            => await Clients.Group("SignalR Users").ReceiveMessage(user, message);

        public async Task Echo(string user, string message)
            => await Clients.Caller.ReceiveMessage(user, new ScrumPokerMessage { EventName = "echo", Message = $"{message} - {Guid.NewGuid()}" });

    }
}
