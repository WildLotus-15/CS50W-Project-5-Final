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

    /*

    const img = document.createElement('img')
    img.className = "card-img-top"
    img.alt = "Card img cap"
    post_card.append(img)

    */

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

    const view_comments = document.createElement('a')
    view_comments.id = `post-view-comments-${post.id}`
    view_comments.href = "#"
    view_comments.innerHTML = "Comments"
    post_card.append(view_comments)

    view_comments.addEventListener('click', () => load_comments(post.id))

    const comments = document.createElement('div')
    comments.id = `post-comments-${post.id}`
    post_card.append(comments)

    document.querySelector("#posts").append(post_card)
}

function build_comment(comment, post_id) {
    document.getElementById(`post-comments-${post_id}`).style.display = "unset"

    const comment_card = document.createElement('div')
    comment_card.id = `post-comment-card-${post_id}`

    const comment_author = document.createElement('div')
    comment_author.innerHTML = comment.author_username
    comment_card.append(comment_author)

    const comment_content = document.createElement('div')
    comment_content.innerHTML = comment.comment
    comment_card.append(comment_content)

    const comment_timestamp = document.createElement('div')
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
    })

    const view_comments = document.getElementById(`post-view-comments-${post_id}`)
    view_comments.style.display = "none"

    const post_body = view_comments.parentNode

    const hide_comments = document.createElement('a')
    hide_comments.id = `post-comment-hide-${post_id}`
    hide_comments.href = "#"
    hide_comments.innerHTML = "Hide"
    post_body.append(hide_comments)

    hide_comments.addEventListener('click', () => {
        fetch(`post/${post_id}/comments`)
        .then(response => response.json())
        .then(response => {
            response.comments.forEach(comment => hide_comment(post_id, comment))
        })    
    })

    const comment_input = document.createElement('input')
    comment_input.className = "form-control"
    comment_input.id = `post-comment-input-${post_id}`
    post_body.append(comment_input)

    const save_button = document.createElement('button')
    save_button.innerHTML = "Save"
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
            } else {
                alert("You cant comment!")
            }
            save_button.remove()
            comment_input.remove()
            view_comments.style.display = "unset"
        })
    })
}

function hide_comment(post_id) {
    document.getElementById(`post-comment-save-button-${post_id}`).style.display = "none"
    document.getElementById(`post-comment-input-${post_id}`).style.display = "none"

    document.getElementById(`post-comments-${post_id}`).style.display = "none"

    document.getElementById(`post-comment-hide-${post_id}`).style.display = "none"

    document.getElementById(`post-view-comments-${post_id}`).style.display = "block"
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
    })
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
