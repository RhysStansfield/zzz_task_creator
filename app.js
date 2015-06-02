(function() {

  return {
    requests: {
      getActiveUsers: function() {
        return {
          url: 'https://www.zzz.co.uk/api/users?active=true',
          // url: 'https://d152e937.ngrok.io/api/users?active=true',
          headers: { "Authorization": "Basic " + this.setting('token') + ":" },
          type: 'GET',
          // secure: true, // comment out when testing with zat
          contentType: 'application/json'
        };
      },

      postFormData: function(newTaskData) {
        return {
          url: 'https://www.zzz.co.uk/api/general_tasks',
          // url: 'https://d152e937.ngrok.io/api/general_tasks',
          headers: { "Authorization": "Basic " + this.setting('token') + ":" },
          type: 'POST',
          contentType: 'application/json',
          // secure: true, // comment out when testing with zat
          data: JSON.stringify(newTaskData)
        };
      }
    },

    events: {
      'click #add-task': 'postToBeds',
      'app.activated': 'showForm'
    },

    showForm: function() {
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

    eventId: function() {
      console.log(this.ticketFields("Rental Id") + "BEWM");
    }
  };

} ());
