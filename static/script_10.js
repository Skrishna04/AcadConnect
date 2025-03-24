$(document).ready(function() {
    // Confirm Friend Request (Add Friend)
    $('.confirm-btn').on('click', function() {
        var requestId = $(this).data('id');
        
        // Sending AJAX POST request to add the friend
        $.ajax({
            url: '/add_friend',
            method: 'POST',
            data: { id: requestId },
            success: function(response) {
                if (response.success) {
                    // Remove the friend request from the page
                    $('#request-' + requestId).remove();
                } else {
                    alert('Error adding friend');
                }
            },
            error: function() {
                alert('An error occurred while processing the request');
            }
        });
    });

    // Decline Friend Request (Delete)
    $('.decline-btn').on('click', function() {
        var requestId = $(this).data('id');
        
        // Sending AJAX POST request to delete the friend request
        $.ajax({
            url: '/delete_request',
            method: 'POST',
            data: { id: requestId },
            success: function(response) {
                if (response.success) {
                    // Remove the declined request from the page
                    $('#request-' + requestId).remove();
                } else {
                    alert('Error deleting request');
                }
            },
            error: function() {
                alert('An error occurred while processing the request');
            }
        });
    });

    // Add Friend (From Suggestions)
    $('.add-friend-btn').on('click', function() {
        var suggestionId = $(this).data('id');
        
        // Sending AJAX POST request to add friend
        $.ajax({
            url: '/add_friend',
            method: 'POST',
            data: { id: suggestionId },
            success: function(response) {
                if (response.success) {
                    // Remove the suggestion from the page
                    $('#suggestion-' + suggestionId).remove();
                } else {
                    alert('Error adding friend');
                }
            },
            error: function() {
                alert('An error occurred while processing the request');
            }
        });
    });

    // Remove Suggestion
    $('.remove-btn').on('click', function() {
        var suggestionId = $(this).data('id');
        
        // Sending AJAX POST request to remove suggestion
        $.ajax({
            url: '/remove_suggestion',
            method: 'POST',
            data: { id: suggestionId },
            success: function(response) {
                if (response.success) {
                    // Remove the suggestion from the page
                    $('#suggestion-' + suggestionId).remove();
                } else {
                    alert('Error removing suggestion');
                }
            },
            error: function() {
                alert('An error occurred while processing the request');
            }
        });
    });
});
