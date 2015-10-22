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
    tasksQuery.notEqualTo('done', true); // WHERE 'done' not equal to true

    // reference to the task list element
    var tasksList = $('#tasks-list');

    // reference to our rating element
    var ratingElem = $('#rating');

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

    // illustrating how || works for a default value option
    function showMessage(message) {
        message = message || 'Hello';
        alert(message);
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
           var li = $(document.createElement('li')) // jquery way of doing things instead of javascript
               .text(task.get('title'))
               .addClass(task.get('done') ? 'completed-task' : '') // add a task to this new li if a task is done or blank quotes if the task is not completed - abbreviated if/else
               .appendTo(tasksList) // imagine the last three lines are all in line
               .click(function() {
                   task.set('done', !task.get('done')); // toggle the value of the done property between true and false
                   task.save().then(renderTasks, displayError);
               });

            $(document.createElement('span'))
                .raty({readOnly: true,
                    score: (task.get('rating') || 0), // insert the rating or if we don't have it use the default value which we specify (0 in this case)
                    hints: ['crap', 'awful', 'ok', 'nice', 'awesome']})
                .appendTo(li);
        });
    }

    // when the user submits the new task form...
    $('#new-task-form').submit(function(evt) {
        evt.preventDefault(); // tell the browser we will handle the event
        var titleInput = $(this).find('[name="title"]');
        var title = titleInput.val();
        var task = new Task();
        task.set('title', title);
        task.set('rating', ratingElem.raty('score'));
        task.set('title', title); // a parse method
        task.save().then(fetchTasks, displayError)
            .then(function() { // when it is saved refetch all tasks from the server
                titleInput.val('');
                ratingElem.raty('set', {});
            });
        return false;
    });

    // go and fetch tasks from the server
    fetchTasks(); // the catalyst that makes everything start

    ratingElem.raty();

    // timer
    //window.setInterval(fetchTasks, 3000); // pass fetchTasks without () because you want to pass the function, not invoke it

});