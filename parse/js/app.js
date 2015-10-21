/*
    script for the index.html file
*/

Parse.initialize("eVUdYRBHSZBMIbHcPHd8TwupxjvsHJECvvyPlt6P", "2TubT0UXRDM7XSgLxPUpoX4vSfHG589MlBdW5QMq");

$(function() {
    'use strict';

    // new Task class for parse
    var Task = Parse.Object.extend('Task'); // the class in parse (think of as the table name)

    // new query that will return all tasks ordered by createdAt
    var tasksQuery = new Parse.Query(Task);
    tasksQuery.ascending('createdAt');

    // reference to the task list element
    var tasksList = $('#tasks-list');

    // reference to the error message alert
    var errorMessage = $('#error-message'); // just like query selector all, but jquery has abbreviated syntax

    // current set of tasks
    var tasks = [];

    function displayError(err) {
        errorMessage.text(err.message);
        errorMessage.fadeIn();
    }

    function clearError(err) {
        errorMessage.hide();
    }

    function showSpinner() {
        $('.fa-spin').show();
    }

    function hideSpinner() {
        $('.fa-spin').hide();
    }

    function fetchTasks() {
        showSpinner();
        tasksQuery.find().then(onData, displayError) // invoke an ajax request to the server to get all tasks - asynchronous operation
        .always(hideSpinner);
    }

    // what happens when fetchTasks is successful, not a failure
    function onData(results) {
        tasks = results; // so that the tasks array is no longer empty
        renderTasks();
    }

    function renderTasks() { // doesn't need a parameter because of scope
        tasksList.empty();
        tasks.forEach(function(task) {
           $(document.createElement('li')) // jquery way of doing things instead of javascript
               .text(task.get('title'))
               .appendTo(tasksList); // imagine the last three lines are all in line
        });
    }

    // when the user submits the new task form...
    $('#new-task-form').submit(function(evt) {
        evt.preventDefault(); // tell the browser we will handle the event
        var titleInput = $(this).find('[name="title"]');
        var title = titleInput.val();
        var task = new Task();
        task.set('title', title); // a parse method
        task.save().then(fetchTasks, displayError).then(function() { // when it is saved refetch all tasks from the server
            titleInput.val('');
        });
        return false;
    });

    // go and fetch tasks from the server
    fetchTasks(); // the catalyst that makes everything start

    // timer
    //window.setInterval(fetchTasks, 3000); // pass fetchTasks without () because you want to pass the function, not invoke it

});