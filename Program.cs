using signalr_scrumpoker.Hubs;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR().AddAzureSignalR();

var app = builder.Build();

app.UseDefaultFiles();
app.UseRouting();
app.UseStaticFiles();
app.MapHub<ScrumPokerHub>("/scrumpokerhub");
app.Run();
app.MapGet("/", () => "App is running.");

app.Run();
