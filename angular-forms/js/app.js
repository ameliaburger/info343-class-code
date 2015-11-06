/*
    script file for the index.html page
*/

angular.module('ContactsApp', ['ui.router', 'angular-uuid', 'LocalStorageModule'])
// parameters above are module names loaded by script elements in index.html
    .constant('storageKey', 'contacts-list') // value is contacts-list
    .factory('contacts', function(uuid, localStorageService, storageKey) {
        return localStorageService.get(storageKey) || [];

        /*
        // a factory is a fancy way to create some data, fetch data models and make them
        // available to multiple controllers at the same time

        // factory method is only executed once: the first time it's requested
        return [{
            id: 'default-delete-me',
            fname: 'Fred',
            lname: 'Flintstone',
            phone: '206-555-1212',
            dob: '1/1/1900'
        }];
        */
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('list', {
                url: '/contacts', // local url = url will appear in browser after hash sign addressing some part of page
                templateUrl: 'views/contacts-list.html',
                controller: 'ContactsController'
            })
            .state('detail', {
                url: '/contacts/:id',
                templateUrl: 'views/contact-detail.html',
                controller: 'ContactDetailController'
            })
            .state('edit', {
                url: '/contacts/:id/edit',
                templateUrl: 'views/edit-contact.html',
                controller: 'EditContactController'
            });

        $urlRouterProvider.otherwise('/contacts');
    })

    // register a directive for custom validation of dates in the past
    .directive('inThePast', function() {
        return {
            require: 'ngModel',
            link: function(scope, elem, attrs, controller) {
                controller.$validators.inThePast = function(modelValue) {
                    // finally get to write the validator
                    var today = new Date();
                    return (new Date(modelValue) <= today);
                }
            }
        };
    })

    .controller('ContactsController', function($scope, contacts) { // initialization function
        $scope.contacts = contacts;
    })
    .controller('ContactDetailController', function($scope, $stateParams, $state, contacts) {
        $scope.contact = contacts.find(function(contact) {
           return contact.id === $stateParams.id; // set from url: 'contacts/:id'
        });
    })
    .controller('EditContactController', function($scope, $stateParams, $state, uuid,
                                                  localStorageService, storageKey, contacts) {
        var existingContact = contacts.find(function(contact) {
            return contact.id === $stateParams.id; // return the contact for which this description returns true
        });

        $scope.contact = angular.copy(existingContact);

        $scope.save = function() {
            if ($scope.contact.id) {
                // copy our edits back to the original contact
                angular.copy($scope.contact, existingContact);
            } else {
                $scope.contact.id = uuid.v4();
                contacts.push($scope.contact);
            }

            localStorageService.set(storageKey, contacts);

            $state.go('list');
        }
    });
