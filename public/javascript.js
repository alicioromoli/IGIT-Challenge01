let inputSearch = null
let tabUsersFound = null
let tabStatistic = null
let usersFoundCount = 0
let users = []
let usersFiltered = []
let buttonSearch = null

window.addEventListener('load', ()=> {
    inputSearch = document.querySelector('#inputSearch')
    buttonSearch = document.querySelector('.btn')
    
    searchUser()
})

const searchUser = async () => {
    const res = await fetch('http://localhost:3001/users')
    const json = await res.json()
    users = json.map(user => ({
        name: `${user.name.first} ${user.name.last}`,
        age: user.dob.age,
        img: user.picture.medium,
        gender: user.gender
    }))

    const getUsers = (value)=> {
        usersFiltered = users.filter(user => user.name.toLowerCase().includes(value))
        render()
    }

    const handleInputSearch = (e)=> {
        buttonSearch.classList.remove('disabled')
        if(e.target.value.trim() == ""){
            e.preventDefault()
            buttonSearch.classList.add('disabled')
        }

        if(e.key == "Enter" && e.target.value.trim() != ""){
            getUsers(e.target.value)
        }
    }
    const addButtonEffect = ()=> {
        const value = inputSearch.value
        getUsers(value)
    }

    inputSearch.focus()
    inputSearch.addEventListener('keyup', handleInputSearch)
    buttonSearch.addEventListener('click', addButtonEffect)
}

const render = ()=> {
    renderFoundUsers()
    renderUsersSum()
    renderStatistics()
}

const renderFoundUsers = ()=> {
    tabUsersFound = document.querySelector('.section__users')
    
    let userFilteredDiv = ""
    usersFiltered.forEach(user => {
        const {name, img, gender, age} = user
        userFilteredDiv += "<div class='user'>"
        userFilteredDiv += `
        <img src="${img}" alt="${gender}">
        <p>${name}, age ${age}</p>
        `
        userFilteredDiv += "</div>"
    })
    tabUsersFound.innerHTML = userFilteredDiv
}

const renderUsersSum = ()=> {
    usersFoundCount = document.querySelector('#users-found')
    usersFoundCount.textContent = `${usersFiltered.length} users have found`
}

const renderStatistics = ()=>{
    
    tabStatistic = document.querySelector('.tabStatistic')
    
    const males = usersFiltered.filter(user => user.gender == "male").length
    const females = usersFiltered.filter(user => user.gender == "female").length
    const ageSum = usersFiltered.reduce((acc, curr)=> {
        return acc + curr.age
    }, 0)
    const averageAge = Math.ceil(ageSum / usersFiltered.length) || 0
    
    let userFilteredDiv = `<span>Statistics</span>
                        <ul>`
    userFilteredDiv += `
        <li>Male: <strong>${males}</strong></li>
        <li>Female: <strong>${females}</strong></li>
        <li>Age sum: <strong>${ageSum}</strong></li>
        <li>Average age: <strong>${averageAge}</strong></li>
    `
    userFilteredDiv += "</ul>"

    tabStatistic.innerHTML = userFilteredDiv
}
