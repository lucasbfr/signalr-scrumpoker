# signalr-scrumpoker
Simple SignalR implementation for scrum poker

# SignalR setup
* Create a SignalR resource on Azure, to host the server.
* Create an app service to host the .Net 6.0 code

# Dev setup
Initialize the secret store and use the connection string
`dotnet user-secrets init`

`dotnet user-secrets set Azure:SignalR:ConnectionString "xxx"`
with xxx the signalR connection string found in the Azure config

# "Production" setup
Note: do not actually use this in production, there is no user authentication.
Add a configuration key "Azure:SignalR:ConnectionString" with the connection string to SignalR