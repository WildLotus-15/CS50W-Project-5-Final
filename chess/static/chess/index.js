document.addEventListener("DOMContentLoaded", () => {
    load_posts("")

    if (document.getElementById('favourite')) {
        document.getElementById('favourite').addEventListener('click', () => load_posts('/favourite'))
    } else {
        document.getElementById(`newPost`).addEventListener('click', () => force_login())
    }

    document.querySelector('form').onsubmit = create_post
})

function force_login() {
    document.getElementById('login').click()
}

function load_posts(addon) {
    if (addon.includes('?')) {
        addon += ''
    } else if (addon.includes('/')) {
        document.querySelector("#newPost").style.display = 'none'
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
    post_card.className = "card col-sm-6 mx-auto"
    post_card.id = `post-card-${post.id}`

    const image = document.createElement('img')
    image.className = 'card-img-top'
    image.id = `post-image-${post.id}`
    image.src = post.image
    post_card.append(image)

    const post_body = document.createElement('div')
    post_body.className = "card-body"
    post_card.append(post_body)

    const drop_down = document.createElement('div')
    drop_down.id = `post-drop-down-${post.id}`
    drop_down.className = "dropdown text-right"
    post_body.append(drop_down)

    const drop_button = document.createElement('button')
    drop_button.className = "btn btn-secondary dropdown-toggle"
    drop_button.type = "button"
    drop_button.id = "dropdownMenuButton"
    drop_button.ariaHasPopup = "true"
    drop_button.ariaExpanded = "false"
    drop_button.innerHTML = "..."
    drop_button.setAttribute("data-toggle", "dropdown")
    drop_down.append(drop_button)

    const drop_menu = document.createElement('div')
    drop_menu.ariaLabel = "dropdownMenuButton"
    drop_menu.className = "dropdown-menu"
    drop_down.append(drop_menu)

    if (post.editable) {
        const edit_button = document.createElement("a")
        edit_button.className = "dropdown-item"
        edit_button.href = "#"
        edit_button.id = `post-edit-button-${post.id}`
        edit_button.innerHTML = "Edit"
        edit_button.addEventListener('click', () => edit_post(post, post_card))

        drop_menu.append(edit_button)

        const remove_button = document.createElement('a')
        remove_button.href = "#"
        remove_button.className = "dropdown-item"
        remove_button.id = `post-remove-button-${post.id}`
        remove_button.innerHTML = "Remove"
        remove_button.addEventListener('click', () => remove_post(post.id))

        drop_menu.append(remove_button)
    }

    const image_download = document.createElement('a')
    image_download.href = post.image
    image_download.download = post.image
    image_download.innerHTML = "Download"
    image_download.className = "dropdown-item"
    image_download.id = `post-image-download-${post.id}`
    drop_menu.append(image_download)

    const add_favourite = document.createElement('a')
    add_favourite.href = "#"
    add_favourite.className = "dropdown-item"
    if (post.favourited) {
        add_favourite.innerHTML = "Remove From Favourites"
    } else {
        add_favourite.innerHTML = "Add To Favourites"
    }
    add_favourite.id = `post-add-favourite-${post.id}`
    drop_menu.append(add_favourite)

    add_favourite.addEventListener('click', () => update_favourites(post))

    const author = document.createElement('div')
    author.className = "card-title"
    author.id = `post-author`
    author.innerHTML = post.author_username
    post_body.append(author)

    author.addEventListener('click', () => show_profile(post.author_id))

    const description = document.createElement('div')
    description.className = "card-text"
    description.id = `post-description-${post.id}`
    description.innerHTML = post.description
    post_body.append(description)

    const timestamp = document.createElement('div')
    timestamp.className = "text-muted"
    timestamp.id = `post-timestamp-${post.id}`
    timestamp.innerHTML = post.timestamp
    post_body.append(timestamp)

    const likes_row = document.createElement('div')
    likes_row.id = `post-likes-row-${post.id}`
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
    
    const likes_amount = document.createElement('div')
    likes_amount.className = "post-likes-amount"
    likes_amount.id = `post-likes-amount-${post.id}`
    likes_amount.innerHTML = post.likes
    if (post.likes == 0) {
        likes_amount.style.display = "none"
    } else {
        likes_amount.style.display = "inline"
    }
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

    post_card.append(post_body)
    document.querySelector("#posts").append(post_card)
}

function update_favourites(post) {
    fetch(`post/${post.id}/update_favourites`)
    .then(response => response.json())
    .then(response => {
        if (response.newFavourite) {
            document.getElementById(`post-add-favourite-${post.id}`).innerHTML = "Remove From Favourites"
        } else {
            document.getElementById(`post-add-favourite-${post.id}`).innerHTML = "Add To Favourites"
            window.location.reload()
        }
    })
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
            document.getElementById(`post-likes-amount-${post_id}`).style.display = "inline"
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
        document.getElementById('profile_joined').innerHTML = response.profile_joined
        document.getElementById('profile_post_amount').innerHTML = response.profile_posts

        console.log(response)
    })
}

function build_comment(comment, post_id) {
    const comment_card = document.createElement('div')
    comment_card.id = `post-comment-card-${post_id}`

    if (comment.editable) {
        const comment_dropdown = document.createElement('div')
        comment_dropdown.className = "dropdown text-right"
        comment_dropdown.id = `comment-dropdown-${comment.id}`
        comment_card.append(comment_dropdown)
        
        const comment_dropdown_button = document.createElement('button')
        comment_dropdown_button.innerHTML = "..."
        comment_dropdown_button.className = "btn btn-secondary dropdown-toggle"
        comment_dropdown_button.type = "button"
        comment_dropdown_button.ariaHasPopup = "true"
        comment_dropdown_button.ariaExpanded = "false"
        comment_dropdown_button.setAttribute("data-toggle", "dropdown")
        comment_dropdown.append(comment_dropdown_button)

        const comment_dropdown_menu = document.createElement('div')
        comment_dropdown_menu.className = "dropdown-menu"
        comment_dropdown.append(comment_dropdown_menu)

        const comment_edit = document.createElement('a')
        comment_edit.className = "dropdown-item"
        comment_edit.href = "#"
        comment_edit.id = `post-comment-edit-${comment.id}`
        comment_edit.innerHTML = "Edit"
        comment_dropdown_menu.append(comment_edit)
    
        comment_edit.addEventListener('click', () => edit_comment(comment, post_id))    

        const comment_remove = document.createElement('a')
        comment_remove.href = "#"
        comment_remove.className = "dropdown-item"
        comment_remove.id = `post-comment-remove-${comment.id}`
        comment_remove.innerHTML = "Remove"
        comment_dropdown_menu.append(comment_remove)

        comment_remove.addEventListener('click', () => remove_comment(comment, post_id))
    }

    const comment_author = document.createElement('div')
    comment_author.id = `post-comment-author-${comment.id}`
    comment_author.innerHTML = comment.author_username
    comment_card.append(comment_author)

    const comment_content = document.createElement('div')
    comment_content.id = `comment-content-${comment.id}`
    comment_content.innerHTML = comment.comment
    comment_card.append(comment_content)

    const comment_timestamp = document.createElement('div')
    comment_timestamp.id = `post-comment-timestamp-${comment.id}`
    comment_timestamp.className = "text-muted" 
    comment_timestamp.innerHTML = comment.timestamp
    comment_card.append(comment_timestamp)

    const likes_row = document.createElement('div')
    likes_row.id = `post-comment-likes-row-${comment.id}`
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

    const likes_amount = document.createElement('div')
    likes_amount.id = `comment-likes-amount-${comment.id}`
    likes_amount.innerHTML = comment.likes
    if (comment.likes == 0) {
        likes_amount.style.display = "none"
    } else {
        likes_amount.style.display = "inline"
    }
    likes_row.append(likes_amount)

    const comments = document.getElementById(`post-comments-${post_id}`)
    comments.append(comment_card)
}

function update_comment_like(comment_id, like_amount) {
    fetch(`comment/${comment_id}/update_like`)
    .then(response => response.json())
    .then(response => {
        if (response.newLike) {
            document.getElementById(`comment-likes-logo-${comment_id}`).src = "static/chess/heart-fill.svg"
        } else {      
            document.getElementById(`comment-likes-logo-${comment_id}`).src = "static/chess/heart.svg"
        }

        if (response.newAmount == 0) {
            document.getElementById(`comment-likes-amount-${comment_id}`).style.display = "none"
        } else {
            document.getElementById(`comment-likes-amount-${comment_id}`).style.display = "inline"
        }
        document.getElementById(`comment-likes-amount-${comment_id}`).innerHTML = response.newAmount
    })
}

function load_comments(post_id) {
    fetch(`post/${post_id}/comments`)
    .then(response => response.json())
    .then(response => {
        response.comments.forEach(comment => build_comment(comment, post_id))
        document.getElementById(`post-comments-amount-${post_id}`).innerHTML = `Comments ${response.comments_amount}`
    })

    const post_comments_amount = document.getElementById(`post-comments-amount-${post_id}`)

    const view_comments = document.getElementById(`post-view-comments-${post_id}`)
    view_comments.style.display = "none"

    const post_body = view_comments.parentNode

    document.getElementById(`post-comments-${post_id}`).style.display = "block"

    const first_row = document.createElement('div')
    first_row.style.display = "flex"
    post_body.append(first_row)

    const comments_amount = document.createElement('div')
    comments_amount.style.display = "flex: 1"
    comments_amount.id = `post-comments-amount-${post_id}`
    first_row.append(comments_amount)

    const hide_button = document.createElement('button')
    hide_button.innerHTML = "Hide"
    hide_button.className = "btn btn-primary"
    hide_button.style.display = "flex: 1"
    hide_button.id = `post-comment-hide-button-${post_id}`
    first_row.append(hide_button)

    const row = document.createElement('div')
    row.style.display = "flex"
    post_body.append(row)

    const comment_input = document.createElement('input')
    comment_input.className = "form-control"
    comment_input.display = "flex: 1"
    comment_input.id = `post-comment-input-${post_id}`
    row.append(comment_input)

    const save_button = document.createElement('button')
    save_button.innerHTML = "Add"
    save_button.className = "btn btn-primary"
    comment_input.display = "flex: 1"
    save_button.id = `post-comment-save-button-${post_id}`
    row.append(save_button)

    hide_button.addEventListener('click', () => {
        document.getElementById(`post-comments-${post_id}`).style.display = "none" 
        document.getElementById(`post-comments-amount-${post_id}`).style.display = "none" 
        document.getElementById(`post-view-comments-${post_id}`).style.display = "block"
        document.getElementById(`post-comment-hide-button-${post_id}`).remove() 
        document.getElementById(`post-comment-save-button-${post_id}`).remove() 
        document.getElementById(`post-comment-input-${post_id}`).remove()
    })

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
                const comments_amount = document.getElementById(`post-view-comments-${post_id}`)

                comments_amount.innerHTML = `Comments ${response.newAmount}`
                
                const like_logo = document.createElement('img')
                like_logo.id = `post-comments-created-like-logo-${response.comment_id}`
                like_logo.src = "static/chess/heart.svg"

                const like_amount = document.createElement('div')
                like_amount.id = `post-comments-created-amount-${response.comment_id}`
                if (response.newAmount == 0) {
                    like_amount.style.display = 'none'
                } else {
                    like_amount.style.display = "block"
                }

                like_logo.addEventListener('click', () => update_created_comment_like(response.comment_id, like_logo, like_amount))

                const comment_dropdown = document.createElement('div')
                comment_dropdown.className = "dropdown text-right"
                comment_dropdown.id = `comment-created-dropdown-${response.comment_id}`
                
                const comment_dropdown_button = document.createElement('button')
                comment_dropdown_button.innerHTML = "..."
                comment_dropdown_button.className = "btn btn-secondary dropdown-toggle"
                comment_dropdown_button.type = "button"
                comment_dropdown_button.ariaHasPopup = "true"
                comment_dropdown_button.ariaExpanded = "false"
                comment_dropdown_button.setAttribute("data-toggle", "dropdown")
                comment_dropdown.append(comment_dropdown_button)

                const comment_dropdown_menu = document.createElement('div')
                comment_dropdown_menu.className = "dropdown-menu"
                comment_dropdown.append(comment_dropdown_menu)

                const comment_edit = document.createElement('a')
                comment_edit.className = "dropdown-item"
                comment_edit.href = "#"
                comment_edit.id = `post-comment-edit-${comment.id}`
                comment_edit.innerHTML = "Edit"
                comment_dropdown_menu.append(comment_edit)
            
                comment_edit.addEventListener('click', () => edit_created_comment(response.comment_id, post_id, like_amount, like_logo))    

                const comment_remove = document.createElement('a')
                comment_remove.href = "#"
                comment_remove.className = "dropdown-item"
                comment_remove.id = `post-comment-remove-${comment.id}`
                comment_remove.innerHTML = "Remove"
                comment_dropdown_menu.append(comment_remove)

                comment_remove.addEventListener('click', () => remove_created_comment(response.comment_id, post_id, like_amount, like_logo))

                const comment_author = document.createElement('div')
                comment_author.id = `post-comment-created-author-${response.comment_id}`
                comment_author.innerHTML = response.author

                const comment_content = document.createElement('div')
                comment_content.id = `post-comment-created-content-${response.comment_id}`
                comment_content.innerHTML = comment

                const comment_timestamp = document.createElement('div')
                comment_timestamp.className = "text-muted"
                comment_timestamp.id = `post-comment-created-timestamp-${response.comment_id}`
                comment_timestamp.innerHTML = response.timestamp

                comments.append(comment_dropdown)
                comments.append(comment_author)
                comments.append(comment_content)
                comments.append(comment_timestamp)
                comments.append(like_logo)
                comments.append(like_amount)

                document.getElementById(`post-comments-amount-${post_id}`).innerHTML = `Comments ${response.newAmount}`
            } else {
                alert("You cant comment!")
            }
        })
    })
}

function update_created_comment_like(comment_id, like_logo, like_amount) {
    fetch(`comment/${comment_id}/update_like`)
    .then(response => response.json())
    .then(response => {
        if (response.newLike) {
            like_logo.src = "static/chess/heart-fill.svg"
        } else {
            like_logo.src = "static/chess/heart.svg"
        }

        if (response.newAmount == 0) {
            like_amount.style.display = "none"
        } else {
            like_amount.style.display = "inline"
        }

        like_amount.innerHTML = response.newAmount
    })
}

function create_post() {
    const formData = new FormData()

    const image = document.getElementById('image')
    const description = document.getElementById("description").value

    if (!image.files[0]) {
        formData.append('description', description)    
    } else {
        formData.append('image', image.files[0])
        formData.append('description', description)            
    }
    
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

function edit_post(post, post_card) {
    const author = document.getElementById(`post-author-${post.id}`)
    const content = document.getElementById(`post-description-${post.id}`)
    const image = document.getElementById(`post-image-${post.id}`)
    const comments = document.getElementById(`post-view-comments-${post.id}`)
    const likes_row = document.getElementById(`post-likes-row-${post.id}`)
    const drop_down = document.getElementById(`post-drop-down-${post.id}`)
    const timestamp = document.getElementById(`post-timestamp-${post.id}`)

    const post_body = content.parentNode

    const new_image_form = document.createElement('input')
    new_image_form.id = `new_image_${post.id}`
    new_image_form.type = 'file'
    new_image_form.accept = "image/png, image/jpg"
    post_body.append(new_image_form)

    const new_description_form = document.createElement('input')
    new_description_form.id = `new-content-${post.id}`
    new_description_form.type = "textarea"
    new_description_form.className = "form-control"
    new_description_form.value = content.innerHTML
    post_body.append(new_description_form)

    document.getElementById(`post-author-${post.id}`).remove()
    document.getElementById(`post-timestamp-${post.id}`).remove()
    document.getElementById(`post-image-${post.id}`).remove()
    document.getElementById(`post-description-${post.id}`).remove()
    document.getElementById(`post-drop-down-${post.id}`).remove()
    document.getElementById(`post-view-comments-${post.id}`).remove()
    document.getElementById(`post-likes-row-${post.id}`).remove()

    const save_button = document.createElement('button')
    save_button.innerHTML = "Save"
    save_button.className = "btn btn-primary"
    post_body.append(save_button)
    
    save_button.addEventListener("click", () => {
        const new_description = document.getElementById(`new-content-${post.id}`).value
        const new_image = document.getElementById(`new_image_${post.id}`)

        const formData = new FormData()

        formData.append('new_image', new_image.files[0])
        formData.append('new_description', new_description)
        formData.append("post_id", post.id)

        console.log(formData.get("new_image"))

        fetch(`/post/${post.id}/edit`, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: formData
        })
        .then(response => response.json())
        .then(response => {
            content.innerHTML = new_description
            image.src = response.new_image

            new_description_form.remove()
            new_image_form.remove()
            save_button.remove()
            cancel_button.remove()
            
            post_card.append(image)
            post_body.append(drop_down)
            post_body.append(author)
            post_body.append(content)
            post_body.append(timestamp)
            post_body.append(likes_row)
            post_body.append(comments)
            post_card.append(post_body)

            console.log(response.message)
        })
    })

    const cancel_button = document.createElement('button')
    cancel_button.className = "btn btn-danger"
    cancel_button.innerHTML = "Cancel"
    cancel_button.id = `post-edit-cancel-button-${post.id}`
    post_body.append(cancel_button)

    cancel_button.addEventListener('click', () => {
        new_description_form.remove()
        save_button.remove()
        cancel_button.remove()
        new_image_form.remove()

        post_card.append(image)
        post_body.append(drop_down)
        post_body.append(author)
        post_body.append(content)
        post_body.append(timestamp)
        post_body.append(likes_row)
        post_body.append(comments)
        post_card.append(post_body)
    })
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function edit_comment(comment, post_id) {
    const content = document.getElementById(`comment-content-${comment.id}`)

    const likes_row = document.getElementById(`post-comment-likes-row-${comment.id}`)
    const comment_author = document.getElementById(`post-comment-author-${comment.id}`)
    const timestamp = document.getElementById(`post-comment-timestamp-${comment.id}`)
    const dropdown = document.getElementById(`comment-dropdown-${comment.id}`)

    const comment_body = content.parentNode

    const new_content_form = document.createElement('input')
    new_content_form.type = "textarea"
    new_content_form.id = `new_content_${comment.id}`
    new_content_form.className = "form-control"
    new_content_form.value = content.innerHTML
    comment_body.append(new_content_form)

    document.getElementById(`comment-dropdown-${comment.id}`).remove()
    document.getElementById(`comment-content-${comment.id}`).remove()
    document.getElementById(`post-comment-likes-row-${comment.id}`).remove()
    document.getElementById(`post-comment-timestamp-${comment.id}`).remove()
    document.getElementById(`post-comment-author-${comment.id}`).remove()

    const save_button = document.createElement('button')
    save_button.className = "btn btn-primary"
    save_button.id = `post-comment-edit-save-button-${comment.id}`
    save_button.innerHTML = "Save"
    comment_body.append(save_button)

    save_button.addEventListener('click', () => {
        const new_content = document.getElementById(`new_content_${comment.id}`).value

        fetch(`/post/${post_id}/comment`, {
            method: "PUT",
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({
                "action": "edit",
                "comment_id": comment.id,
                "new_comment": new_content
            })
        })
        .then(response => response.json())
        .then(response => {
            content.innerHTML = new_content

            save_button.remove()
            new_content_form.remove()
            cancel_button.remove()

            comment_body.append(dropdown)
            comment_body.append(comment_author)
            comment_body.append(content)
            comment_body.append(timestamp)
            comment_body.append(likes_row)
        })
    })

    const cancel_button = document.createElement('button')
    cancel_button.className = "btn btn-danger"
    cancel_button.innerHTML = "Cancel"
    comment_body.append(cancel_button)

    cancel_button.addEventListener('click', () => {
        new_content_form.remove()
        save_button.remove()
        cancel_button.remove()

        comment_body.append(dropdown)
        comment_body.append(comment_author)
        comment_body.append(content)
        comment_body.append(timestamp)
        comment_body.append(likes_row)
    })
}

function remove_comment(comment, post_id) {
    fetch(`post/${post_id}/comment`, {
        method: "PUT",
        headers: {
            'X-CSRFToken': getCookie("csrftoken")
        },
        body: JSON.stringify({
            "action": "remove",
            "comment_id": comment.id,
            "post_id": post_id
        })
    })
    .then(response => response.json())
    .then(response => {
        document.getElementById(`post-comment-timestamp-${comment.id}`).remove()
        document.getElementById(`post-comment-likes-row-${comment.id}`).remove()
        document.getElementById(`post-comment-author-${comment.id}`).remove()
        document.getElementById(`comment-content-${comment.id}`).remove()
        document.getElementById(`comment-dropdown-${comment.id}`).remove()

        document.getElementById(`post-comments-amount-${post_id}`).innerHTML = `Comments ${response.newAmount}`
        document.getElementById(`post-view-comments-${post_id}`).innerHTML = `Comments ${response.newAmount}`
    })
}

function remove_post(post_id) {
    fetch(`post/${post_id}/remove`, {
        method: "PUT",
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },
        body: JSON.stringify({
            "post_id": post_id
        })
    })
    .then(response => response.json())
    .then(response => {
        document.getElementById(`post-card-${post_id}`).remove()
    })
}

function remove_created_comment(comment_id, post_id) {
    fetch(`post/${post_id}/comment`, {
        method: "PUT",
        headers: {
            'X-CSRFToken': getCookie("csrftoken")
        },
        body: JSON.stringify({
            "action": "remove",
            "comment_id": comment_id,
            "post_id": post_id
        })
    })
    .then(response => response.json())
    .then(response => {
        document.getElementById(`post-comments-created-like-logo-${comment_id}`).remove()
        document.getElementById(`post-comment-created-author-${comment_id}`).remove()
        document.getElementById(`post-comment-created-timestamp-${comment_id}`).remove()
        document.getElementById(`post-comment-created-content-${comment_id}`).remove()
        document.getElementById(`comment-created-dropdown-${comment_id}`).remove()
        
        document.getElementById(`post-comments-amount-${post_id}`).innerHTML = `Comments ${response.newAmount}`
        document.getElementById(`post-view-comments-${post_id}`).innerHTML = `Comments ${response.newAmount}`
    })
}

function edit_created_comment(comment_id, post_id, like_logo, like_amount) {
    const content = document.getElementById(`post-comment-created-content-${comment_id}`)

    const comment_author = document.getElementById(`post-comment-created-author-${comment_id}`)
    const timestamp = document.getElementById(`post-comment-created-timestamp-${comment_id}`)
    const dropdown = document.getElementById(`comment-created-dropdown-${comment_id}`)

    const comment_body = content.parentNode

    const new_content_form = document.createElement('input')
    new_content_form.type = "textarea"
    new_content_form.id = `new_content_${comment_id}`
    new_content_form.className = "form-control"
    new_content_form.value = content.innerHTML
    comment_body.append(new_content_form)

    document.getElementById(`comment-created-dropdown-${comment_id}`).remove()
    document.getElementById(`post-comment-created-content-${comment_id}`).remove()
    document.getElementById(`post-comments-created-like-logo-${comment_id}`).remove()
    document.getElementById(`post-comments-created-amount-${comment_id}`).remove()
    document.getElementById(`post-comment-created-timestamp-${comment_id}`).remove()
    document.getElementById(`post-comment-created-author-${comment_id}`).remove()

    const save_button = document.createElement('button')
    save_button.className = "btn btn-primary"
    save_button.id = `post-comment-edit-save-button-${comment_id}`
    save_button.innerHTML = "Save"
    comment_body.append(save_button)

    save_button.addEventListener('click', () => {
        const new_content = document.getElementById(`new_content_${comment_id}`).value

        fetch(`/post/${post_id}/comment`, {
            method: "PUT",
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({
                "action": "edit",
                "comment_id": comment_id,
                "new_comment": new_content
            })
        })
        .then(response => response.json())
        .then(response => {
            content.innerHTML = new_content

            save_button.remove()
            new_content_form.remove()
            cancel_button.remove()

            comment_body.append(dropdown)
            comment_body.append(comment_author)
            comment_body.append(content)
            comment_body.append(timestamp)  
            comment_body.append(like_logo)
            comment_body.append(like_amount)
        })
    })

    const cancel_button = document.createElement('button')
    cancel_button.className = "btn btn-danger"
    cancel_button.innerHTML = "Cancel"
    comment_body.append(cancel_button)

    cancel_button.addEventListener('click', () => {
        new_content_form.remove()
        save_button.remove()
        cancel_button.remove()

        comment_body.append(dropdown)
        comment_body.append(comment_author)
        comment_body.append(content)
        comment_body.append(timestamp)
        comment_body.append(like_logo)
        comment_body.append(like_amount)
    })
}