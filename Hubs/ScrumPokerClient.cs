using Microsoft.AspNetCore.SignalR;

namespace signalr_scrumpoker.Hubs
{
    public interface IScrumPokerClient
    {
        Task ReceiveMessage(string user, ScrumPokerMessage message);
    }

    public class ScrumPokerMessage
    {
        public string EventName { get; set; }
        public string Message { get; set; }

    }
}
