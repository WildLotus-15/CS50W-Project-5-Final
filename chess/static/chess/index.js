document.addEventListener("DOMContentLoaded", () => {
    load_posts("")

    document.querySelector('form').onsubmit = create_post
})

function load_posts(addon) {
    fetch(`load_posts${addon}`)
    .then(response => response.json())
    .then(response => {
        console.log(response.posts)
        response.posts.forEach(post => build_post(post))
    })
}

function build_post(post) {
    const post_card = document.createElement('div')
    post_card.className = "card"

    const author = document.createElement('div')
    author.className = "card-title"
    author.innerHTML = post.author_username
    post_card.append(author)

    const description = document.createElement('div')
    description.className = "card-text"
    description.innerHTML = post.description
    post_card.append(description)

    const timestamp = document.createElement('div')
    timestamp.className = "text-muted"
    timestamp.innerHTML = post.timestamp
    post_card.append(timestamp)

    const comment_amount = document.createElement('div')
    comment_amount.innerHTML = post.comments

    const view_comments = document.createElement('a')
    view_comments.id = `post-view-comments-${post.id}`
    view_comments.href = "#"
    view_comments.innerHTML = `Comments ${post.comments}`
    post_card.append(view_comments)

    view_comments.addEventListener('click', () => load_comments(post.id))

    const comments = document.createElement('div')
    comments.id = `post-comments-${post.id}`
    post_card.append(comments)

    document.querySelector("#posts").append(post_card)
}

function build_comment(comment, post_id) {
    const comment_card = document.createElement('div')
    comment_card.id = `post-comment-card-${post_id}`

    const comment_author = document.createElement('div')
    comment_author.innerHTML = comment.author_username
    comment_card.append(comment_author)

    const comment_content = document.createElement('div')
    comment_content.innerHTML = comment.comment
    comment_card.append(comment_content)

    const comment_timestamp = document.createElement('div')
    comment_timestamp.className = "text-muted" 
    comment_timestamp.innerHTML = comment.timestamp
    comment_card.append(comment_timestamp)

    const comments = document.getElementById(`post-comments-${post_id}`)
    comments.append(comment_card)
}

function load_comments(post_id) {
    fetch(`post/${post_id}/comments`)
    .then(response => response.json())
    .then(response => {
        response.comments.forEach(comment => build_comment(comment, post_id))
        document.getElementById(`post-comments-amount-${post_id}`).innerHTML = `Comments ${response.comments_amount}`
    })

    const view_comments = document.getElementById(`post-view-comments-${post_id}`)
    view_comments.style.display = "none"

    const post_body = view_comments.parentNode

    document.getElementById(`post-comments-${post_id}`).style.display = "block"

    const comments_amount = document.createElement('div')
    comments_amount.style.display = "block"
    comments_amount.id = `post-comments-amount-${post_id}`
    post_body.append(comments_amount)

    const comment_input = document.createElement('input')
    comment_input.className = "form-control"
    comment_input.id = `post-comment-input-${post_id}`
    post_body.append(comment_input)

    const hide_button = document.createElement('button')
    hide_button.innerHTML = "Hide"
    hide_button.id = `post-comment-hide-button-${post_id}`
    post_body.append(hide_button)

    hide_button.addEventListener('click', () => {
        document.getElementById(`post-comments-${post_id}`).style.display = "none" // Hiding all comments
        document.getElementById(`post-comment-hide-button-${post_id}`).remove() // Hiding hide button itself
        document.getElementById(`post-comment-save-button-${post_id}`).remove() // Hiding save button
        document.getElementById(`post-comment-input-${post_id}`).remove() // Hiding comment input
        document.getElementById(`post-comments-amount-${post_id}`).style.display = "none" // Hiding comment amount indicator
        document.getElementById(`post-view-comments-${post_id}`).style.display = "block" // Unhiding view comments button
    })

    const save_button = document.createElement('button')
    save_button.innerHTML = "Add"
    save_button.className = "btn btn-primary"
    save_button.id = `post-comment-save-button-${post_id}`
    post_body.append(save_button)

    save_button.addEventListener("click", () => {
        const comment = document.getElementById(`post-comment-input-${post_id}`).value

        fetch(`post/${post_id}/comment`, {
            method: "POST",
            headers: {
                'X-CSRFToken': getCookie("csrftoken")
            }, 
            body: JSON.stringify({
                "post_id": post_id,
                "comment": comment
            })
        })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                const comments = document.getElementById(`post-comments-${post_id}`)
                comments.append(comment)
                comments.append(response.author)
                comments.append(response.timestamp)
                document.getElementById(`post-comments-amount-${post_id}`).innerHTML = `Comments ${response.newAmount}`
            } else {
                alert("You cant comment!")
            }
        })
    })
}

function create_post() {
    const description = document.getElementById("description").value

    fetch('create_post', {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },
        body: JSON.stringify({
            "description": description
        })
    })
    .then(response => response.json())
    .then(response => {
        console.log(response.message)
        window.location.reload()
    })
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
