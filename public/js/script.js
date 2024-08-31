(async function () {
    const api = await fetch('http://localhost:8000/blog/api/allCategory')
    const response = await api.json()
    let categorie = ''
    response.forEach(categoryobj => {
        categorie += `<option data-select2-id="1" value="${categoryobj._id}" >
                    ${categoryobj.category}
                    </option>`
    })
    document.querySelector('#categoryBox').insertAdjacentHTML('beforeEnd', categorie)
})() // Immediately Invoked Function Expression (IIFE)


document.querySelector('#submitPost').addEventListener('submit', async (e) => {
    e.preventDefault()
    const blog_description = $('#summernote').summernote('code').trim()

    const formData = new FormData(e.target)
    formData.append('blog_description', blog_description)

    await fetch('http://localhost:8000/blog/api/createPost', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then((data) => {
            AlertMessage(data.message, 'Post Created Unsucessfull!', 'Post Created sucessfull!')
            document.querySelector('#submitPost').reset()
        })
})


function AlertMessage(message, erroMessage, sucsessMessage) {
    const ToastElement = document.querySelector('#toast-container .toast')

    ToastElement.style.opacity = '1'
    if (erroMessage == message) {
        ToastElement.classList.remove('toast-success')
        ToastElement.classList.add('toast-error')
        ToastElement.innerHTML = message
    } else if (sucsessMessage == message) {
        ToastElement.classList.remove('toast-error')
        ToastElement.classList.add('toast-success')
        ToastElement.innerHTML = message
    }
    setTimeout(() => {
        ToastElement.style.opacity = '0'
    }, 3000)
}