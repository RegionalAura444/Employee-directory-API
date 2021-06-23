document.addEventListener('DOMContentLoaded',() => {
    
    ///////////////////////////////////////
    //////   GLOBAL VARIABLES
    ///////////////////////////////////////

    const modalBtn = document.querySelector('.modal-closebtn')
    const modal = document.querySelector('#modal-container')
    const overlay = document.querySelector('.overlay')
    const APIUrl = `https://randomuser.me/api/?results=12&inc=name, picture, email, location, phone, dob &noinfo &nat=US`
    const gridContainer = document.querySelector('.grid-container')
    const input = document.getElementById('search')
    const nextBtn = document.querySelector('.nextBtn')
    const prevBtn = document.querySelector('.previousBtn')

    let container;
    let employees = []
    

    ///////////////////////////////////////
    //////   SEARCH FUNCTIONALITY
    ///////////////////////////////////////

    const handleSearch = e => {
        let inputValue = e.target.value.toLowerCase()
        let names = document.querySelectorAll('.name')
    
        for(let i = 0; i < names.length; i++) {
            let person = names[i]
            let name = person.innerHTML.toLowerCase();
            name.includes(inputValue) ? person.style.display = 'inline' : person.parentNode.parentNode.parentNode.style.display = 'none'
            if(inputValue === '') {
            person.parentNode.parentNode.parentNode.style.display = 'inline'
            }
        }
        }
        input.addEventListener('keyup', handleSearch)

    ///////////////////////////////////////
    //////   FETCH 
    ///////////////////////////////////////

    function fetchData(url) {
    return fetch(url)
        .then(res => res.json())
        .then(res => res.results)
        .catch(err => console.log(err))
    }
    fetchData(APIUrl)
        .then(data => displayEmployees(data))

    //Display Employees
    const displayEmployees = data => {
        employees = data;
        //map over the array of employees and place in gridContainer
        gridContainer.innerHTML = employees.map((employee, index) => {
        //destructure properties in array
        const {name, email, location, picture} = employee;
        return `<div class="card" index=${index}>
            <div class="card-container">
            <img class="${name.first} profile" src=${picture.large} />
            <div class="text-container">
                <h2 class="name">${name.first} ${name.last}</h2>
                <p class="email">${email}</p>
                <p class="city">${location.city}</p>
            </div>
            </div>
            </div>`
        })
        .join('')
    }

    ///////////////////////////////////////
    //////   MODAL 
    ///////////////////////////////////////
    
    const displayModal = (index) => {
        const { picture ={ large }, name, email, dob, location = { city, street, state, postcode }, phone } = employees[index]

        //Formatting Date
        let date = new Date(dob.date);
        let currDate = date.getDate()
        //Add zero to the front of the date if there is no zero
        currDate = currDate > 9 ? currDate : "0" + currDate;

        let currMonth = date.getMonth();
        currMonth = currMonth > 9 ? currMonth : "0" + currMonth;

        let currYear = date.getFullYear()
        let formattedDate = `${currMonth}/${currDate}/${currYear}`

        let modalHTML = '';
        modalHTML += `
        <div class="container">
            <img src=${picture.large} alt="${name.first}">
            <div class="text-container">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="city">${location.city}</p>
            <hr/>
            <p class='phone'>${phone}</p>
            <p class="address">${location.street.number} ${location.street.name}, ${location.state} ${location.postcode}</p>
            <p class='bday'>Birthday: ${formattedDate} </p>
        </div>
        </div>`
        
        overlay.classList.remove("hidden");
        modal.innerHTML = modalHTML; 

        nextBtn.addEventListener('click', () => handleNextBtn(index));
        prevBtn.addEventListener('click', () => handlePrevBtn(index))
    }
  
    ///////////////////////////////////////
    //////  MODAL BUTTONS
    ///////////////////////////////////////


    const handleNextBtn = (currentIndex) => {
        let newIndex = currentIndex + 1;
        return displayModal(newIndex)
    }

    const handlePrevBtn = (currentIndex) => {
    let newIndex = currentIndex - 1;
    return displayModal(newIndex)
    }

    gridContainer.addEventListener('click', e => {
    if (e.target !== gridContainer) {
        const card = e.target.closest(".card");
        const string = card.getAttribute("index")
        const index = parseInt(string)
        displayModal(index); 
    }

    modalBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
        container = document.querySelector('.modal-container')  
    });
    })

});