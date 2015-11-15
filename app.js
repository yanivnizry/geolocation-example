GeoLog = new Mongo.Collection('geo_log');

if (Meteor.isServer) {
    Meteor.startup(function() {
        Meteor.publish('basic', function() {
            return GeoLog.find({}, {
                fields: {
                    userId: 0
                },
                sort: {
                    created: 1
                },
                limit: 100
            });
        });
        Meteor.methods({
            clear: function() {
                GeoLog.remove({});
            }
        });
    });
}

if (Meteor.isClient) {
    Meteor.startup(function() {
        Meteor.subscribe('basic');
        Template.footer.helpers({
            isCordova: function() {
                return Meteor.isCordova;
            }
        });
        Template.footer.events({
            'click #getNow': function() {
                if (Meteor.isCordova) {
                    // cordova
                    // GeolocationFG.get(function(location) {
                    GeoLog.insert({
                    location: function (){ return Geolocation.currentLocation().coords; },
                        // uuid: GeolocationBG.uuid(),
                        // device: GeolocationBG.device(),
                        userId: Meteor.userId(),
                        created: new Date()
                    });
                    // });
                    return;
                }
                // browser
                // GeolocationFG.get(function(location) {
                GeoLog.insert({
                    location: function (){ return Geolocation.currentLocation().coords; },
                    uuid: 'browser',
                    device: 'browser',
                    userId: Meteor.userId(),
                    created: new Date()
                });
                // });
            },
            'click #getBackground': function(event) {
                var btn = event.currentTarget;
                var dest = document.getElementById('btnFeedback');
                if (!Meteor.isCordova) {
                    /*Enable background mode

BackgroundMode.enable();
Disable background mode

BackgroundMode.disable();
Check if background mode is enabled (reactive)

BackgroundMode.enabled.get();
Check if the app is currently running in the background (reactive)

BackgroundMode.active.get();
*/


                    dest.innerHTML = 'Not Available, Not Cordova';
                    return;
                }
                if (!BackgroundMode.enabled.get()) {
                    if (!BackgroundMode.active.get()) {
                      dest.innerHTML = 'ERROR: Not Started, unable to start';
                      return;
                    }
                    if (!BackgroundMode.active.get()) {
                        dest.innerHTML = 'ERROR: Not Started, status = false';
                        return;
                    }
                    dest.innerHTML = 'Started (every few minutes there should be an update)';
                    btn.innerHTML = 'Stop';
                    return;
                }
                if (!BackgroundMode.disable()) {
                    dest.innerHTML = 'ERROR: Not Stopped, unable to stop';
                    return;
                }
                if (BackgroundMode.active.get()) {
                    dest.innerHTML = 'ERROR: Not Stopped, status = true';
                    return;
                }
                dest.innerHTML = 'Stopped';
                btn.innerHTML = 'Start';
                return;
            },
            'click #clear': function(event) {
                Meteor.call('clear');
                return;
            }
        });
    });
}

if (Meteor.isCordova) {
    // GeolocationBG.config({
    //   url: 'https://geolocationbackgroundexample.meteor.com/api/geolocation',
    //   debug: true
    // });
    // triggered by a start button
    // GeolocationBG.start();
    BackgroundMode.enable();
}