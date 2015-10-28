/* 
    script for the tasks.html file 
*/

angular.module('Tasks', [])
    .constant('tasksKey', 'tasks')
    .controller('TasksController', function($scope, tasksKey) {
        'use strict'

        // dependency injection: pass parameters rather than having global variables or variables of higher scope

        // initialize tasks property on the scope to an empty array
        $scope.tasks = angular.fromJson(localStorage.getItem('tasks')) || [];
        // initialize newTask to an empty object
        $scope.newTask = {};

        function saveTasks() {
            localStorage.setItem('tasks', angular.toJson($scope.tasks))
        }

        // add a function to add newTask to teh array
        $scope.addTask = function() {
            // push the current value of newTask into the tasks array
            $scope.tasks.push($scope.newTask);

            // save the tasks
            saveTasks();

            // reset newTask to an empty object
            $scope.newTask = {};
        };

        // function to toggle task done state
        $scope.toggleDone = function(task) {
            task.done = !task.done;
            saveTasks();
        }
    });

// declaring relationships between data and html elements that angular will enforce