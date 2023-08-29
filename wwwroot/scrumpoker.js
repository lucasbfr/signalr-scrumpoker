var votes = [];
var users = [];
const messageInput = $('#message');
const messageBox = $('#messages-received');
var connection;

function enableInput() {
    $('#sendmessage').removeClass('is-disabled')
    $('#echo').removeClass('is-disabled')
}

function disableInput() {
    $('#sendmessage').addClass('is-disabled')
    $('#echo').addClass('is-disabled')
}
function createMessageEntry(userName, message, argument) {
    var div = $('<p class="avp-alert u-margin-bottom-small"><i class="alert-icon" aria-hidden="true"></i> </p>');
    var messageSpan = $('<span class="alert-message"></span>')
    var user = $('<span class="u-font-semi-bold"></span>');
    var text = $('<span></span>');
    text.text(message);

    if (userName === "_SYSTEM_") {
        div.addClass("alert--warning");
    } else if (userName === "_BROADCAST_") {
        div.addClass("alert--warning");
    } else if (userName === username) {
        div.addClass("alert--validation");
        user.text(username + ': ');

    } else {
        div.addClass("alert--information");
        user.text(username + ': ');
    }
    messageSpan.append(user);
    messageSpan.append(text);
    div.append(messageSpan);
    return div;
}

function startVote() {
    console.log('start vote');
    connection.send('vote', username, 'start');
}

function endVote() {
    console.log('end vote');
    connection.send('vote', username, 'end');
}

function voteStarted() {
    $('#voteButtons').show();
    $('#vote-start').addClass('is-disabled');
    $('#vote-end').removeClass('is-disabled');
    votes = [];
    $('#voteCount').hide();
}

function voteEnded() {
    $('#voteButtons').hide();
    $('#vote-end').addClass('is-disabled');
    $('#vote-start').removeClass('is-disabled');

    var div = $('<div class="u-margin-top--medium u-margin-bottom--medium"><h3 class="u-margin-bottom--small">Vote result</h3></div>')
    var table = $('<table class="avp-table table--horizontal-stripe"></table>');
    var body = $('<tbody></tbody>')

    for (var row = 0; row < votes.length; row++) {
        var vote = votes[row];
        console.log(vote);
        body.append($('<tr><th scope="row">' + votes[row].name + '</th><td>' + votes[row].value + '</td></tr>'));
    }

    table.append(body);
    div.append(table);
    messageBox.append(div);
    $('#voteCount').hide();
}

function vote(element) {
    var value = $(element.currentTarget).text();
    console.log('Voting: ' + value);

    connection.send('vote', username, value);
}

function addUser(user) {
    if (user) {

        if (users.indexOf(user) < 0) {
            users[users.length] = user;
        }
        $('#userCount').text(users.length + ' known users.')
    }
}

function bindConnectionMessage(connection) {
    var messageCallback = function (name, message, argument) {
        console.log('Received message ' + name + ': ' + message);
        if (!message) return;
        var messageEntry = createMessageEntry(name, message, argument);

        messageBox.append(messageEntry);
        if (name && name[0] == '_') {
            // the argument is the user name
            addUser(argument);
        } else {
            addUser(name);
        }
    };

    var voteCallback = function (name, value) {
        if (value === 'start') {
            var messageEntry = createMessageEntry('_BROADCAST_', name + ' has started a vote', name);
            messageBox.append(messageEntry);
            voteStarted();
        } else if (value === 'end') {
            var messageEntry = createMessageEntry('_BROADCAST_', name + ' has ended a vote', name);
            messageBox.append(messageEntry);
            voteEnded();
        } else {
            var message = (name === username) ? 'voted ' + value : 'voted';
            var existingVote = votes.findIndex(v => v.name === name);
            if (existingVote >= 0) {
                votes[existingVote] = { name: name, value: value };
                message += ' (changed)';
            }
            else {
                votes[votes.length] = { name: name, value: value };
            }

            var messageEntry = createMessageEntry(name, message, null);
            messageBox.append(messageEntry);

            var voteCount = $('#voteCount');
            voteCount.text(votes.length + ' votes.')
            voteCount.show();
        }
        addUser(name);
    };

    connection.on('broadcastMessage', messageCallback);
    connection.on('echo', messageCallback);
    connection.on('vote', voteCallback);
    connection.onclose(onConnectionError);
};

function onConnected(connection) {
    console.log('connection started');
    enableInput();
    connection.send('broadcastMessage', '_SYSTEM_', username + ' joined the room', username);

    $('#sendmessage').click((event) => {
        var message = messageInput.val();
        console.log('sending message sendmessage: ' + message);
        if (message) {
            connection.send('broadcastMessage', username, message, username);
        }

        messageInput.val('');
        messageInput.focus();
        event.preventDefault();
    });

    $('#echo').click((event) => {
        var message = 'Echo at ' + new Date();
        console.log('sending message echo: ' + message);
        if (message) {
            connection.send('echo', username, message);
        }

        messageInput.val('');
        messageInput.focus();
        event.preventDefault();
    });

    $('#vote-end').click(endVote);
    $('#vote-start').click(startVote);
    $('.ctx-vote-button').click(vote);

    $('#voteButtonsControl').show();
}

function onConnectionError(error) {
    if (error && error.message) {
        console.error(error.message);
    }
    disableInput();
    $("#connectionError").show();
}

function start() {
    connection = new signalR.HubConnectionBuilder()
        .withUrl('/scrumpokerhub')
        .build();
    bindConnectionMessage(connection);
    connection.start()
        .then(() => onConnected(connection))
        .catch(error => console.error(error.message));

}

function login() {

    username = $('#name-input').val();

    console.log('logging in as ' + username);
    if (!username || username.startsWith('_') || username.indexOf('<') > -1 || username.indexOf('>') > -1) {
        alert('Invalid input. Enter your name.')
    }
    else {
        $('#login-page').hide();
        $('#scrumPoker-page').show();
        messageInput.focus();
        start();
    }
}

// Code below is executed upon page load

$('#login-button').click(login);
$('#name-input').focus();

document.getElementById('message').addEventListener('keypress', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        $('#sendmessage').click();
        return false;
    }
});
document.getElementById('name-input').addEventListener('keypress', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        $('#login-button').click();
        return false;
    }
});
console.log('app loaded.');