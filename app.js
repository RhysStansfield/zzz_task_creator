(function() {

  return {
    requestMethods: {
      utils: {
        zatEnabled: false,

        _baseUrl: function() {
          return 'https://' + this.domainName + '/api';
        },

        _baseParams: function() {
          var params = {
            headers:     this.headerParams(),
            contentType: 'application/json'
          };

          if (!this.zatEnabled) {
            params.secure = true;
          }

          return params;
        },

        buildParams: function(url, type, data) {
          var params = this._baseParams();

          params.url  = url;
          params.type = type;

          if (type === 'POST' && data) {
            params.data = data;
          }

          return params;
        },

        buildUrl: function(path) {
          return this._baseUrl() + path;
        },

        headerParams: function() {
          if (this.zatEnabled) {
            return { 'Authorization': 'Basic ' + this.token + ':' };
          }

          return { 'Authorization': "Basic {{setting.token}}:" };
        }
      },

      GET: function(path) {
        var fullUrl = this.utils.buildUrl(path);

        return this.utils.buildParams(fullUrl, 'GET');
      },

      POST: function(path, data) {
        var fullUrl = this.utils.buildUrl(path);

        return this.utils.buildParams(fullUrl, 'POST', JSON.stringify(data));
      }
    },

    requests: {
      getActiveUsers: function() {
        return this.requestMethods.GET('/users?active=true');
      },

      getProperty: function(propertyId) {
        return this.requestMethods.GET('/properties/' + propertyId);
      },

      getEvents: function() {
        return this.requestMethods.GET('/events?current_events=true');
      },

      getEvent: function(eventId) {
        return this.requestMethods.GET('/events/' + eventId);
      },

      getRental: function(eventId, reference) {
        return this.requestMethods.GET(
          '/rentals/find?event_id=' + eventId + '&reference=' + reference
        );
      },

      postFormData: function(newTaskData) {
        return this.requestMethods.POST('/general_tasks', newTaskData);
      }
    },

    events: {
      'app.activated':   'init',
      'click #add-task': 'postToBeds',
      'ticket.custom_field_27022572.changed': 'typeChanged',
      'ticket.custom_field_25728342.changed': 'setReference',
      'ticket.custom_field_27112811.changed': 'findEvent'
    },

    init: function() {
      this.hideTicketFields();
      this.setUpEnvironment();
      this.showForm();
      this.fetchEventDetails();
    },

    setUpEnvironment: function() {
      if (this.isZatEnabled()) {
        this.requestMethods.utils.zatEnabled = true;
        this.requestMethods.utils.token      = this.setting('token');
      }
      this.requestMethods.utils.domainName = this.setting('domainName');
    },

    showForm: function() {
      this.ajax('getActiveUsers').then(
        function(userData) {
          this.switchTo('form', { users: userData });
          this.setReference();
        },
        function() {
          services.notify('Could not fetch user list!', 'error');
        }
      );
    },

    hideTicketFields: function() {
      this.ticketFields('custom_field_26659611').hide();
      this.ticketFields('custom_field_26659111').hide();
      this.ticketFields('custom_field_26659121').hide();
    },

    fetchEventDetails: function() {
      var eventId = this.ticket().customField('custom_field_26659111');

      if (eventId.length === 0) {
        return;
      }

      this.ajax('getEvent', eventId).then(
        function(eventData) {
          var nameAndYear      = eventData.name + ' ' + eventData.year,
              eventTicketField = this.ticket().customField('custom_field_27112811');

          if (nameAndYear != eventTicketField) {
            this.ticket().customField('custom_field_27112811', nameAndYear);
          }
        },
        function() {}
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
        function() {
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
    },

    setReference: function() {
      var reference = this.ticket().customField('custom_field_25728342'),
          refPieces;

      if (reference.search(/-/) >= 0) {
        refPieces = reference.split(/-/);
        reference = refPieces[refPieces.length - 1];
      }

      if (reference.length != 4) {
        return;
      }

      this.$('#reference-key').val(reference);

      this.ajax('getProperty', reference).then(
        function(propertyData) {
          var address = propertyData.address;
          this.$('.property-address').html(address);
        },
        function() {}
      );
    },

    findEvent: function() {
      var eventName = this.ticket().customField('custom_field_27112811');

      if (!/\d{4}$/.test(eventName)) {
        return;
      }

      this.ajax('getEvent', eventName).then(
        function(eventData) {
          this.ticket().customField('custom_field_26659111', eventData.id);
          this.findRental();
        },
        function() {
          services.notify('Could not find event - double check spelling and year', 'error');
        }
      );
    },

    findRental: function() {
      var eventId   = this.ticket().customField('custom_field_26659111'),
          reference = this.$('#reference-key').val();

      if (eventId.length === 0 || reference.length != 4) {
        return;
      }

      this.ajax('getRental', eventId, reference).then(
        function(rentalData) {
          var rentalCompany = rentalData.booking.company,
              companyField  = this.ticket().customField('custom_field_27112821');

          if (rentalCompany != companyField){
            this.ticket().customField('custom_field_27112821', rentalCompany);
          }
        },
        function() {
          this.ticket().customField('custom_field_27112821', '');
        }
      );
    }
  };

} ());
