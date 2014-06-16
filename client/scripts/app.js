// YOUR CODE HERE:

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  init: function(){},
  send: function(message){
    $.ajax({
      type: 'POST',
      url: this.server,
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(){
        console.log('message sent');
      },
      error: function(){
        console.error('Error sending message');
      }
    });
  },
  fetch: function(){
    var self = this;
    $.ajax({
      type: 'GET',
      url: this.server,
      contentType: 'application/json',
      data: JSON.stringify({order: 'createdAt'}),
      success: function(data){

        self.renderMessages(data.results);
      },
      error: function(){
        console.error('Error: fetching messages')
      }

    });
  },
  addMessage: function(messageObject){
    var $messages =  $('#chats');
    var $messageContainer = $('<li class="chat">')
    var $currentMessage = $('<span>');
    var $userName = $('<span class= "username">');
    $userName.text(messageObject.username);
    $currentMessage.text(': ' + messageObject.text);
    $messageContainer.append($userName);
    $messageContainer.append($currentMessage);
    $messages.append($messageContainer);

  },
  renderMessages: function(messageArray){
    for(var i = 0; i<messageArray.length; i++){
      this.addMessage(messageArray[i]);
    }
  },
  clearMessages: function(){
    $('#chats').empty();
  },
  addRoom: function(roomName){
    $('#roomSelect')
  }
};

// data.result
