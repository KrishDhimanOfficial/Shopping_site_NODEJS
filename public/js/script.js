document.querySelector('#addCategory').addEventListener('click', async (e) => {
    e.preventDefault();

    let category = document.querySelector('#createcategory');
    if (!category.value) {
        return;
    }
    await fetch('http://localhost:8000/blog/api/createCategory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: category.value.trim() })
    })
        .then(response => response.json())
        .then(data => {
            category.value = ''
            document.querySelector('.error').style.display = 'block';
            document.querySelector('.error').innerHTML = data.message
        })
    setTimeout(() => {
        document.querySelector('.error').style.display = 'none';
    }, 3000);
})

getAllcategories()
async function getAllcategories() {
    const api = await fetch('http://localhost:8000/blog/api/allCategory')
    const response = api.json()
    let categorie = ''
    response.then(data => {
        data.forEach(category => {
            categorie += `<option data-select2-id="1" value="${category._id}" >
                    ${category.category}
                    </option>`
        })
        document.querySelector('#categoryBox').insertAdjacentHTML('beforeEnd', categorie)
    })
}

document.querySelector('#submitPost').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target)
    await fetch('http://localhost:8000/blog/api/createPost', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then((data) => {
        console.log(data);
        document.querySelector('#submitPost').reset()    
    })
})