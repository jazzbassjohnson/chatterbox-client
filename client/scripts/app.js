// YOUR CODE HERE:

  var app = {
    server: 'https://api.parse.com/1/classes/chatterbox',
    init: function(){
      this.friends= {};
      this.username = window.location.search.slice(10);
      this.fetch();
      var self = this;
      setInterval(function() {
        // self.clearMessages.call(self);
        self.fetch.call(self);
      }, 5000);
    },
    send: function(message){
      var self = this;
      $.ajax({
        type: 'POST',
        url: this.server,
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function(data){
          //construct message object
          var messageObject = {
            //text
            text: message.text,
            //username
            username: self.username,
            //objectId
            objectId: data.objectId
          };
          //call addMessage with message  object as argument
          self.addMessage(messageObject);
          console.log(data);
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

      var self = this;
      var $messages =  $('#chats');
      var $messageContainer = $('<li id="'+ messageObject.objectId +'" class="chat">');
      var $currentMessage = $('<span class="message">');
      if(this.friends[messageObject.username]){
        $currentMessage.addClass('friend');
      }
      var $username = $('<span class= "username">');
      $username.click(function(){
        var username = $(this).text();
        self.addFriend(username);
        $('.message').each(function(){
          if($(this).prev('.username').text() === username){
            $(this).addClass('friend');
          }
        });
      });
      $username.text(messageObject.username);
      $currentMessage.text(': ' + messageObject.text);
      $messageContainer.append($username);
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
    },
    addFriend: function(username){
      this.friends[username] = true;
    }
  };

$(document).ready(function(){

  app.init();

  $('button').on('click', app.onEvent.bind(app));

  $('#userMessage').keypress(function(event){
    if (event.which === 13) {
      app.onEvent();
    }
  });

  $('.username').click(function(){
    console.log("clicked");
    var username = $(this).text();

    app.addFriend(username);
    $('.message').each(function(){
      if($(this).closest('.username').text() === username){
        $(this).addClass('friend');
      }
    });
  });

});
