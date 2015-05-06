(function() {

  return {
    requests: {
      getActiveUsers: function() {
        return {
          url: 'https://staging.zzz.co.uk/api/users?active=true',
          // url: 'https://3a988591.ngrok.io/api/users?active=true',
          headers: { "Authorization": "Basic " + this.setting('token') + ":" },
          type: 'GET',
          // secure: true, // comment out when testing with zat
          contentType: 'application/json'
        };
      },

      postFormData: function(newTaskData) {
        return {
          url: 'https://staging.zzz.co.uk/api/task_creator',
          // url: 'https://3a988591.ngrok.io/api/task_creator',
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

    usersFake: function() {
      return [
        {
          "accounts": false,
          "active": true,
          "admin": true,
          "created_at": "2012-05-18T10:04:32Z",
          "email": "tessa@zzz.co.uk",
          "event_team": false,
          "id": 4,
          "job_title": "",
          "junior_admin": true,
          "lock_version": 2926,
          "manager": true,
          "name": "Tessa Erasmus",
          "operations": false,
          "sales": true,
          "updated_at": "2015-03-02T10:44:50Z",
          "zendesk_id": null
        },
        {
          "accounts": true,
          "active": true,
          "admin": false,
          "created_at": "2012-05-18T10:04:31Z",
          "email": "tara@zzz.co.uk",
          "event_team": false,
          "id": 2,
          "job_title": "",
          "junior_admin": false,
          "lock_version": 733,
          "manager": true,
          "name": "Tara Heffler",
          "operations": false,
          "sales": true,
          "updated_at": "2015-03-02T09:19:01Z",
          "zendesk_id": null
        },
        {
          "accounts": false,
          "active": true,
          "admin": true,
          "created_at": "2012-07-23T13:47:46Z",
          "email": "isobel@zzz.co.uk",
          "event_team": false,
          "id": 10,
          "job_title": "administration",
          "junior_admin": false,
          "lock_version": 2823,
          "manager": true,
          "name": "Isobel Petty",
          "operations": false,
          "sales": true,
          "updated_at": "2015-03-02T10:55:26Z",
          "zendesk_id": null
        },
        {
          "accounts": false,
          "active": true,
          "admin": true,
          "created_at": "2012-05-18T10:04:33Z",
          "email": "system@zzz.co.uk",
          "event_team": false,
          "id": 8,
          "job_title": "",
          "junior_admin": false,
          "lock_version": 451,
          "manager": false,
          "name": "Rhys Stansfield",
          "operations": false,
          "sales": false,
          "updated_at": "2015-04-07T13:54:12Z",
          "zendesk_id": null
        }
      ];
    },

    showForm: function() {
      this.ajax('getActiveUsers').then(
        function(userData) {
          this.switchTo('form', { users: userData });
        },
        function() {
          services.notify('Could not fetch user list!', 'error');

          this.switchTo('form', { users: this.usersFake() });
        }
      );
    },

    postToBeds: function(event) {
      event.preventDefault();

      var newTask = {
        task_type: this.$('#task_type').val(),
        user_id: this.$('#user').val(),
        scheduled_for_day: this.$('#scheduled_for_day').val(),
        scheduled_for_time: this.$('#scheduled_for_time').val(),
        location: this.$('#location').val()
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
    }
  };

} ());
