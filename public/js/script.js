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

const inputField = document.getElementById('imageInput');
const imageTag = document.getElementById('imageTag');

inputField.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        imageTag.src = reader.result;
    };
    reader.readAsDataURL(file);
});
document.querySelector('#submitPost').addEventListener('submit', async (e) => {
    e.preventDefault()
    const blog_description = $('#summernote').summernote('code').trim()

    const formData = new FormData(e.target)
    formData.append('blog_description', blog_description)

    await fetch('http://localhost:8000/admin/blog/create', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then((data) => {
            AlertMessage(data.message, 'Post Created Unsucessfull!', 'Post Created sucessfull!')
            $('#summernote').summernote('reset')
            imageTag.src = 'http://localhost:8000/images/Skeleton.png';
            document.querySelector('#submitPost').reset()
        })
})
()()