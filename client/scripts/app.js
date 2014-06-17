// YOUR CODE HERE:
$(document).ready(function(){

  var app = {
    server: 'https://api.parse.com/1/classes/chatterbox',
    init: function(){
      this.username = window.location.search.slice(10);
      this.fetch();
      var self = this;
      setInterval(function() {
        // self.clearMessages.call(self);
        self.fetch.call(self);
      }, 5000);
    },
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
        data: {order: '-createdAt'},
        success: function(data){
          self.renderMessages(data.results);
        },
        error: function(){
          console.error('Error: fetching messages');
        }

      });
    },
    addMessage: function(messageObject){
      var $messages =  $('#chats');
      var $messageContainer = $('<li id="'+ messageObject.objectId +'" class="chat">');
      var $currentMessage = $('<span>');
      var $userName = $('<span class= "username">');
      $userName.text(messageObject.username);
      $currentMessage.text(': ' + messageObject.text);
      $messageContainer.append($userName);
      $messageContainer.append($currentMessage);
      $messages.prepend($messageContainer);

    },
    renderMessages: function(messageArray){
      var id = {};
      $('.chat').each(function(){
        id[$(this).attr('id')] = true;
      });
      for(var i = 0; i<messageArray.length; i++){
        if(!id[messageArray[i].objectId]){
          this.addMessage(messageArray[i]);
        }
      }
    },
    clearMessages: function(){
      $('#chats').empty();
    },
    addRoom: function(roomName){
      var $room = $('<li class="room">');
      $room.text(roomName);
      $('#roomSelect').append($room);
    },
    onEvent: function(){
      var message = {};
      message.username = this.username;
      message.text = $('#userMessage').val();
      $('#userMessage').val('');
      message.roomname = '';
      this.send(message);
      this.fetch();
    }
  };

  app.init();

  $('button').on('click', app.onEvent.bind(app));

  $('#userMessage').keypress(function(event){
    if (event.which === 13) {
      app.onEvent();
    }
  });

});
