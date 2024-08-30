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

    const formData = new FormData(e.target)
    await fetch('http://localhost:8000/blog/api/createPost', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then((data) => {
            console.log(data.message);
            document.querySelector('#submitPost').reset()
        })
    setTimeout(() => {
        document.querySelector('.alert').style.display = 'none';
    }, 3000);
})

