(function() {

  return {
    requests: {
      getActiveUsers: function() {
        return {
          url:         'https://www.zzz.co.uk/api/users?active=true',
          // url:         'https://d23b37af.ngrok.io/api/users?active=true',
          headers:     { "Authorization": "Basic {{setting.token}}:" },
          type:        'GET',
          secure:      true, // comment out when testing with zat
          contentType: 'application/json'
        };
      },

      postFormData: function(newTaskData) {
        return {
          url:         'https://www.zzz.co.uk/api/general_tasks',
          // url:         'https://d23b37af.ngrok.io/api/general_tasks',
          headers:     { "Authorization": "Basic {{setting.token}}:" },
          type:        'POST',
          contentType: 'application/json',
          secure:      true, // comment out when testing with zat
          data:        JSON.stringify(newTaskData)
        };
      }
    },

    events: {
      'click #add-task': 'postToBeds',
      'app.activated':   'showForm',
      'ticket.custom_field_27022572.changed': 'typeChanged'
    },

    showForm: function() {
      this.ticketFields('custom_field_26659611').hide();

      this.ajax('getActiveUsers').then(
        function(userData) {
          this.switchTo('form', { users: userData });
        },
        function() {
          services.notify('Could not fetch user list!', 'error');
        }
      );
    },

    postToBeds: function(event) {
      event.preventDefault();

      var newTask = {
        general_task: {
          user_id:            this.$('#user').val(),
          title:              this.$('#title').val(),
          location:           this.$('#location').val(),
          details:            this.$('#details').val(),
          scheduled_for_day:  this.$('#scheduled_for_day').val(),
          scheduled_for_time: this.$('#scheduled_for_time').val()
        }
      };

      this.ajax('postFormData', newTask).then(
        function(response) {
          this.$('#create-task')[0].reset();
          services.notify('Task created!');
        },
        function () {
          services.notify('Could not create task!', 'error');
        }
      );
    },

    typeChanged: function() {
      var typeField = this.ticket().customField('custom_field_27022572');
      typeField = typeField.replace('_', ' ');
      typeField = typeField.replace(/wifi|^.?| .?/gi, function(match) {
        return match.toUpperCase();
      });

      this.$('#title').val(typeField);
    }
  };

} ());
