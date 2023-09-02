// Sample data for testing
let feedbackData = [
    {
        id: 1,
        category: 'feature',
        feedback: 'Add dark mode to the app.',
        upvotes: 5,
        comments: [
            {
                text: 'Great idea! I love dark mode.'
            },
            {
                text: 'Yes, dark mode is essential nowadays.'
            }
        ],
    },
    {
        id: 2,
        category: 'bug',
        feedback: 'Fix login issue on iOS devices.',
        upvotes: 3,
        comments: [],
    },
];

const itemsPerPage = 5; // Number of feedback items to display per page
let currentPage = 1; // Current page number

// Function to render feedback items based on the current page
function renderFeedbackList() {
    const feedbackList = document.getElementById('feedbackList');
    feedbackList.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const filteredAndSortedData = applyFiltersAndSort(feedbackData);

    const currentData = filteredAndSortedData.slice(startIndex, endIndex);

    currentData.forEach((feedback) => {
        const feedbackItem = document.createElement('div');
        feedbackItem.classList.add('feedback-item');
        feedbackItem.innerHTML = `
            <div class="feedback-header">
                <span class="category ${feedback.category}">${feedback.category}</span>
                <button class="upvote-btn" data-id="${feedback.id}">Upvote</button>
            </div>
            <p class="feedback-text">${feedback.feedback}</p>
            <div class="upvotes">Upvotes: <span class="upvote-count">${feedback.upvotes}</span></div>
            <input type="text" class="comment-input" id="commentInput-${feedback.id}" placeholder="Add a comment...">
            <button class="comment-btn" data-id="${feedback.id}">Add Comment</button>
            <div class="comments">
                ${renderComments(feedback.comments)}
            </div>
        `;

        feedbackList.appendChild(feedbackItem);
    });

    renderPagination(filteredAndSortedData);
}

// Function to render comments
function renderComments(comments) {
    return comments.map((comment) => `
        <div class="comment">
            <p>${comment.text}</p>
        </div>
    `).join('');
}

// Function to handle feedback submission
function submitFeedback(event) {
    event.preventDefault();

    const category = document.getElementById('category').value;
    const feedbackText = document.getElementById('feedback').value;

    // Generate a unique ID
    const id = feedbackData.length + 1;

    // Create a new feedback item
    const newFeedback = {
        id,
        category,
        feedback: feedbackText,
        upvotes: 0,
        comments: [],
    };

    // Add it to the data
    feedbackData.push(newFeedback);

    // Reset the form
    event.target.reset();

    // Render the updated feedback list
    renderFeedbackList();
}

// Function to handle upvoting
function upvoteFeedback(event) {
    if (event.target.classList.contains('upvote-btn')) {
        const feedbackId = parseInt(event.target.getAttribute('data-id'));

        const feedback = feedbackData.find((item) => item.id === feedbackId);
        if (feedback) {
            feedback.upvotes+= 1;

            // Update the upvote count immediately
            const upvoteCountElement = event.target.parentElement.querySelector('.upvote-count');
            if (upvoteCountElement) {
                upvoteCountElement.textContent = feedback.upvotes+1;
            }
        }
    }
}



// Function to handle adding comments
function addComment(event) {
    if (event.target.classList.contains('comment-btn')) {
        const feedbackId = parseInt(event.target.getAttribute('data-id'));
        const feedback = feedbackData.find((item) => item.id === feedbackId);

        if (feedback) {
            // Get the comment input field for the corresponding feedback item
            const commentInput = document.getElementById(`commentInput-${feedback.id}`);

            if (commentInput) {
                const commentText = commentInput.value.trim();

                if (commentText) {
                    feedback.comments.push({ text: commentText });
                    commentInput.value = ''; // Clear the input field
                    renderFeedbackList();
                }
            }
        }
    }
}

// Function to apply filters and sorting to feedback data
function applyFiltersAndSort(data) {
    const filterCategory = document.getElementById('filterCategory').value;
    const sortOption = document.getElementById('sort').value;

    // Filter by category
    const filteredData = filterCategory === 'all' ? data : data.filter((feedback) => feedback.category === filterCategory);

    // Sort based on the selected option
    switch (sortOption) {
        case 'upvotes-desc':
            return filteredData.sort((a, b) => b.upvotes - a.upvotes);
        case 'upvotes-asc':
            return filteredData.sort((a, b) => a.upvotes - b.upvotes);
        case 'comments-desc':
            return filteredData.sort((a, b) => b.comments.length - a.comments.length);
        case 'comments-asc':
            return filteredData.sort((a, b) => a.comments.length - b.comments.length);
        default:
            return filteredData;
    }
}

// Function to render pagination
function renderPagination(data) {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderFeedbackList();
        });

        if (i === currentPage) {
            pageButton.classList.add('active');
        }

        pagination.appendChild(pageButton);
    }
}

// Attach event listeners
document.getElementById('feedbackForm').addEventListener('submit', submitFeedback);
document.getElementById('feedbackList').addEventListener('click', upvoteFeedback);
document.getElementById('feedbackList').addEventListener('click', addComment);
document.getElementById('filterCategory').addEventListener('change', renderFeedbackList);
document.getElementById('sort').addEventListener('change', renderFeedbackList);

// Initial render of feedback list
renderFeedbackList();
