
angular.module('ChatApp', ['firebase'])
    .constant('firebaseUrl', 'https://info343chat.firebaseio.com/messages')
    .controller('ChatController', function($scope, $firebaseArray, firebaseUrl) { // inject reference to fireBase from above
        //create reference to the Firebase
        var ref = new Firebase(firebaseUrl);
        ref.limitToLast(1000);

        $scope.messages = $firebaseArray(ref); // pass ref to object (used here as a function)

        //initialize form fields
        $scope.name = null;
        $scope.body = null;

        $scope.sendMessage = function() {
            //adds a new object to the array and syncrhonizes
            //with the server
            $scope.messages.$add({
                name: $scope.name,
                body: $scope.body,
                createdAt: Firebase.ServerValue.TIMESTAMP
            });

            $scope.body = null;
        }; //sendMessage()
    });
