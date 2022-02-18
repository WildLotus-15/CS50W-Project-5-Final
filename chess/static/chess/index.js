document.addEventListener("DOMContentLoaded", () => {
    load_posts("")

    document.querySelector('form').onsubmit = create_post
})

function load_posts(addon) {
    if (addon.includes('?')) {
        addon += ''
    } else {
        document.querySelector('#profile').style.display = "none"
    }
    fetch(`load_posts${addon}`)
    .then(response => response.json())
    .then(response => {
        document.querySelector('#posts').innerHTML = ''
        response.posts.forEach(post => build_post(post))

        console.log(response.posts)
    })
}

function build_post(post) {
    const post_card = document.createElement('div')
    post_card.className = "card"
    post_card.style.width = "18rem"

    const image = document.createElement('img')
    image.className = 'card-img-top'
    image.id = "post-image"
    image.src = post.image
    post_card.append(image)

    const post_body = document.createElement('div')
    post_body.className = "card-body"
    post_card.append(post_body)

    const author = document.createElement('div')
    author.className = "card-title"
    author.id = "post-author"
    author.innerHTML = post.author_username
    post_body.append(author)

    author.addEventListener('click', () => show_profile(post.author_id))

    const description = document.createElement('div')
    description.className = "card-text"
    description.innerHTML = post.description
    post_body.append(description)

    const timestamp = document.createElement('div')
    timestamp.className = "text-muted"
    timestamp.innerHTML = post.timestamp
    post_body.append(timestamp)

    const likes_row = document.createElement('div')
    likes_row.id = "likes-row"
    post_body.append(likes_row)

    const likes_logo = document.createElement('img')
    if (post.liked) {
        likes_logo.src = "static/chess/heart-fill.svg"
    } else {
        likes_logo.src = "static/chess/heart.svg"
    }
    likes_logo.id = `post-likes-logo-${post.id}`
    likes_row.append(likes_logo)

    likes_logo.addEventListener('click', () => update_like(post.id, post.likes))
    
    const likes_amount = document.createElement('p')
    if (post.likes == 0) {
        likes_amount.style.display = "none"
    } else {
        likes_amount.style.display = "block"        
    }
    likes_logo.className = "likes-row-item"
    likes_amount.id = `post-likes-amount-${post.id}`
    likes_amount.innerHTML = post.likes
    likes_row.append(likes_amount)

    const comment_amount = document.createElement('div')
    comment_amount.innerHTML = post.comments

    const view_comments = document.createElement('a')
    view_comments.id = `post-view-comments-${post.id}`
    view_comments.href = "#"
    view_comments.innerHTML = `Comments ${post.comments}`
    post_body.append(view_comments)

    view_comments.addEventListener('click', () => load_comments(post.id, comments))

    const comments = document.createElement('div')
    comments.id = `post-comments-${post.id}`
    post_body.append(comments)

    document.querySelector("#posts").append(post_card)
}

function update_like(post_id) {
    fetch(`post/${post_id}/update_like`)
    .then(response => response.json())
    .then(response => {
        if (response.newLike) {
            document.getElementById(`post-likes-logo-${post_id}`).src = `static/chess/heart-fill.svg`
            } else {
            document.getElementById(`post-likes-logo-${post_id}`).src = 'static/chess/heart.svg'
        }

        if (response.newAmount == 0) {
            document.getElementById(`post-likes-amount-${post_id}`).style.display = "none"            
        } else {
            document.getElementById(`post-likes-amount-${post_id}`).style.display = "block"
        }

        document.getElementById(`post-likes-amount-${post_id}`).innerHTML = response.newAmount
    })
}

function show_profile(author_id) {
    load_posts(`?profile=${author_id}`)
    document.querySelector('#newPost').style.display = "none"
    document.querySelector('#profile').style.display = "block"
    fetch(`profile/${author_id}`)
    .then(response => response.json())
    .then(response => {
        document.querySelector('#profile_username').innerHTML = response.profile_username
        document.querySelector('#profile_rating').innerHTML = response.profile_rating

        console.log(response)
    })
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

    const likes_row = document.createElement('div')
    comment_card.append(likes_row)

    const likes_logo = document.createElement('img')
    if (comment.liked) {
        likes_logo.src = "static/chess/heart-fill.svg" 
    } else {
        likes_logo.src = "static/chess/heart.svg"
    }
    likes_logo.id = `comment-likes-logo-${comment.id}`
    likes_row.append(likes_logo)

    likes_logo.addEventListener('click', () => update_comment_like(comment.id, post_id))

    const likes_amount = document.createElement('p')
    likes_amount.id = `comment-likes-amount-${comment.id}`
    likes_amount.innerHTML = comment.likes
    if (comment.likes == 0) {
        likes_amount.style.display = "none"
    } else {
        likes_amount.style.display = "block"
    }
    likes_row.append(likes_amount)

    const comments = document.getElementById(`post-comments-${post_id}`)
    comments.append(comment_card)
}

function update_comment_like(comment_id, comments, post_id, like_amount) {
    fetch(`comment/${comment_id}/update_like`)
    .then(response => response.json())
    .then(response => {
        if (response.newLike) {
            if (document.getElementById(`comment-likes-logo-${comment_id}`)) {
                document.getElementById(`comment-likes-logo-${comment_id}`).src = "static/chess/heart-fill.svg"
            } else {
                const like_icon = document.getElementById(`post-comments-created-like-logo-${post_id}`)
                like_icon.src = "static/chess/heart-fill.svg"
            }
        } else {
            if (document.getElementById(`comment-likes-logo-${comment_id}`)) {
                document.getElementById(`comment-likes-logo-${comment_id}`).src = "static/chess/heart.svg"            
            } else {
                const like_icon = document.getElementById(`post-comments-created-like-logo-${post_id}`)
                like_icon.src = "static/chess/heart.svg"
            }
        }

        if (response.newAmount == 0) {
            if (document.getElementById(`comment-likes-amount-${comment_id}`)) {
                document.getElementById(`comment-likes-amount-${comment_id}`).style.display = "none"
            } else {
                like_amount.style.display = "none"
                comments.append(like_amount) 
            }
        } else {
            if (document.getElementById(`comment-likes-amount-${comment_id}`)) {
                document.getElementById(`comment-likes-amount-${comment_id}`).style.display = "unset"
            } else {
                like_amount.style.display = "unset"
                like_amount.innerHTML = response.newAmount
                comments.append(like_amount) 
            }
        }

        if (document.getElementById(`comment-likes-amount-${comment_id}`)) {
            document.getElementById(`comment-likes-amount-${comment_id}`).innerHTML = response.newAmount
        } else {
            console.log('miau')
        }
    })
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
    hide_button.className = "btn btn-primary"
    hide_button.id = `post-comment-hide-button-${post_id}`
    post_body.append(hide_button)

    hide_button.addEventListener('click', () => {
        document.getElementById(`post-comments-${post_id}`).style.display = "none" 
        document.getElementById(`post-comments-amount-${post_id}`).style.display = "none" 
        document.getElementById(`post-view-comments-${post_id}`).style.display = "block"
        document.getElementById(`post-comment-hide-button-${post_id}`).remove() 
        document.getElementById(`post-comment-save-button-${post_id}`).remove() 
        document.getElementById(`post-comment-input-${post_id}`).remove() 
    })

    const save_button = document.createElement('button')
    save_button.innerHTML = "Add"
    save_button.className = "btn btn-primary"
    save_button.id = `post-comment-save-button-${post_id}`
    post_body.append(save_button)

    save_button.addEventListener("click", () => {
        const comment = document.getElementById(`post-comment-input-${post_id}`).value
        document.getElementById(`post-comment-input-${post_id}`).value = ''

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
                const like_logo = document.createElement('img')
                like_logo.id = `post-comments-created-like-logo-${post_id}`
                like_logo.src = "static/chess/heart.svg"

                const like_amount = document.createElement('div')
                like_amount.id = `post-comments-created-amount-${post_id}`

                like_logo.addEventListener('click', () => update_comment_like(response.comment_id, comments, post_id, like_amount))

                comments.append(comment)
                comments.append(like_logo)
                comments.append(like_amount)
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
    const formData = new FormData()

    const image = document.getElementById('image')
    const description = document.getElementById("description").value

    formData.append('image', image.files[0])
    formData.append('description', description)
    

    fetch('create_post', {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },
        body: formData
    })
    .then(response => response.json())
    .then(response => {
        document.getElementById("description").value = ""
        console.log(response.message)
        window.location.reload()
    })
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
