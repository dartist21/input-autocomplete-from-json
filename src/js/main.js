const searchBarInput = document.querySelector('#searchBarInput');
const searchBarClearBtn = document.querySelector('.search-bar__icon-clear');
const departmentList = document.querySelector('#department-list');
const departmentBlock = document.querySelector(".department-block");
const mapBlock = document.querySelector("#map");

searchBarInput.addEventListener('keyup', displaySearchQuery);
searchBarClearBtn.addEventListener('click', clearInput);

function displaySearchQuery(e) {
  departmentBlock.classList.add('department-block--display-none');
  mapBlock.classList.add('department-map--display-none');

  let adressInputValue = e.target.value;
  let searchUrl = 'https://api.privatbank.ua/p24api/pboffice?json&address=' + adressInputValue;

  if (adressInputValue.length === 0) {
    searchBarClearBtn.classList.add('search-bar__icon-clear--display-none');
    clearDepartmentList();
  } else {
    searchBarClearBtn.classList.remove('search-bar__icon-clear--display-none');
    renderDepartmentList();
  }

  function renderDepartmentList() {
    const countryData  = fetch(searchUrl);
    countryData
      .then(response => {
        return response.json();
      })
      .then(data => {
        clearDepartmentList();
        for(let key in data) {
          if (key < 10) {
            let department = document.createElement('li');
            department.classList.add('department-list__item');
            department.addEventListener('click', renderChoosedDepartment);
            department.innerHTML = '<i class="material-icons search-bar__icon-search  noUserSelect">search</i>';
            department.innerHTML += data[key].address;
            department.setAttribute('data-city', data[key].city);
            department.setAttribute('data-country', data[key].country);
            department.setAttribute('data-address', data[key].address);
            department.setAttribute('data-email', data[key].email);
            department.setAttribute('data-phone', data[key].phone);
            department.setAttribute('data-name', data[key].name);
            departmentList.appendChild(department);
          }
        }
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  function renderChoosedDepartment(e) {
    searchBarInput.value = e.target.dataset.address;
    let choosedDepartmentFullAddress =
      e.target.dataset.city + ', ' +
      e.target.dataset.address;
    clearDepartmentList();
    createDepartmentBlock(e.target.dataset);
    initMap(choosedDepartmentFullAddress);
  }

  function createDepartmentBlock(dataset) {
    let locationEl = departmentBlock.querySelector('#location');
    let addressEl = departmentBlock.querySelector('#address');
    let emailEl = departmentBlock.querySelector('#email');
    let phoneEl = departmentBlock.querySelector('#phone');

    if (dataset.country) {
      locationEl.innerHTML = '<i class="material-icons department-block__icon noUserSelect">location_city</i>';
      locationEl.innerHTML += dataset.country;
    }
    if (dataset.city) {
      locationEl.innerHTML += ', ' + dataset.city;
    }
    if (dataset.address) {
      addressEl.innerHTML = '<i class="material-icons department-block__icon noUserSelect">place</i>';
      addressEl.innerHTML += dataset.address;
    }
    if (dataset.email) {
      emailEl.innerHTML = '<i class="material-icons department-block__icon noUserSelect">email</i>';
      emailEl.innerHTML += dataset.email;
    }
    if (dataset.phone) {
      phoneEl.innerHTML = '<i class="material-icons department-block__icon noUserSelect">phone</i>';
      phoneEl.innerHTML += dataset.phone;
    }

    departmentBlock.classList.remove('department-block--display-none');
    mapBlock.classList.remove('department-map--display-none');
  }
}

function clearInput() {
  searchBarClearBtn.classList.add('search-bar__icon-clear--display-none');
  departmentBlock.classList.add('department-block--display-none');
  mapBlock.classList.add('department-map--display-none');
  searchBarInput.value = '';
  clearDepartmentList();
  searchBarInput.focus();
}

function clearDepartmentList() {
  while (departmentList.firstChild) {
      departmentList.removeChild(departmentList.firstChild);
  }
}

//= partials/googlemap.js
