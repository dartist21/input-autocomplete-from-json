class DepartmentApp {
  constructor(props) {
    this.props = Object.assign({}, DepartmentApp.defaults, props);

    this.searchBarInput = document.querySelector(this.props.searchBarInput);
    this.searchBarClearBtn = document.querySelector(this.props.searchBarClearBtn);
    this.departmentList = document.querySelector(this.props.departmentList);
    this.departmentBlock = document.querySelector(this.props.departmentBlock);
    this.locationEl = this.departmentBlock.querySelector(this.props.locationEl);
    this.addressEl = this.departmentBlock.querySelector(this.props.addressEl);
    this.emailEl = this.departmentBlock.querySelector(this.props.emailEl);
    this.phoneEl = this.departmentBlock.querySelector(this.props.phoneEl);
    this.mapBlock = document.querySelector(this.props.mapBlock);

    this.displaySearchQuery = this.displaySearchQuery.bind(this);
    this.renderDepartmentList = this._debounce(this.renderDepartmentList.bind(this), 1000);
    this.renderChoosedDepartment = this.renderChoosedDepartment.bind(this);
    this.createDepartmentBlock = this.createDepartmentBlock.bind(this);
    this.initMap = this.initMap.bind(this);
    this.clearInput = this.clearInput.bind(this);

    this._bindEvents();
  }

  displaySearchQuery(e) {
    console.log('displaySearchQuery');
    this.departmentBlock.classList.add('department-block--display-none');
    this.mapBlock.classList.add('department-map--display-none');

    let adressInputValue = e.target.value;
    let searchUrl = 'https://api.privatbank.ua/p24api/pboffice?json&address=' + adressInputValue;

    if (adressInputValue.length === 0) {
      this.searchBarClearBtn.classList.add('search-bar__icon-clear--display-none');
      this.clearDepartmentList();
    } else {
      this.searchBarClearBtn.classList.remove('search-bar__icon-clear--display-none');
      this.renderDepartmentList(searchUrl);
    }
  }

  renderDepartmentList(searchUrl) {
    console.log('renderDepartmentList');
    console.log(this.departmentList);
    const countryData  = fetch(searchUrl);
    countryData
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        this.clearDepartmentList();
        for(let key in data) {
          if (key < 10) {
            let department = document.createElement('li');
            department.classList.add('department-list__item');
            department.addEventListener('click', this.renderChoosedDepartment);
            department.innerHTML = '<i class="material-icons search-bar__icon-search  noUserSelect">search</i>';
            department.innerHTML += data[key].address;
            department.setAttribute('data-city', data[key].city);
            department.setAttribute('data-country', data[key].country);
            department.setAttribute('data-address', data[key].address);
            department.setAttribute('data-email', data[key].email);
            department.setAttribute('data-phone', data[key].phone);
            department.setAttribute('data-name', data[key].name);
            this.departmentList.appendChild(department);
          }
        }
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  renderChoosedDepartment(e) {
    console.log('renderChoosedDepartment');
    this.searchBarInput.value = e.target.dataset.address;
    let choosedDepartmentFullAddress =
      e.target.dataset.city + ', ' +
      e.target.dataset.address;
    this.clearDepartmentList();
    this.createDepartmentBlock(e.target.dataset);
    this.initMap(choosedDepartmentFullAddress);
  }

  createDepartmentBlock(dataset) {
    console.log('createDepartmentBlockваппвапва');
    if (dataset.country) {
      this.locationEl.innerHTML = '<i class="material-icons department-block__icon UserSelect">location_city</i>';
      this.locationEl.innerHTML += dataset.country;
    }
    if (dataset.city) {
      this.locationEl.innerHTML += ', ' + dataset.city;
    }
    if (dataset.address) {
      this.addressEl.innerHTML = '<i class="material-icons department-block__icon UserSelect">place</i>';
      this.addressEl.innerHTML += dataset.address;
    }
    if (dataset.email) {
      this.emailEl.innerHTML = '<i class="material-icons department-block__icon UserSelect">email</i>';
      this.emailEl.innerHTML += dataset.email;
    }
    if (dataset.phone) {
      this.phoneEl.innerHTML = '<i class="material-icons department-block__icon UserSelect">phone</i>';
      this.phoneEl.innerHTML += dataset.phone;
    }

    this.departmentBlock.classList.remove('department-block--display-none');
    this.mapBlock.classList.remove('department-map--display-none');
  }

  clearInput() {
    this.searchBarClearBtn.classList.add('search-bar__icon-clear--display-none');
    this.departmentBlock.classList.add('department-block--display-none');
    this.mapBlock.classList.add('department-map--display-none');
    this.searchBarInput.value = '';
    this.clearDepartmentList();
    this.searchBarInput.focus();
  }

  initMap(choosedDepartmentFullAddress) {
    let googleAddress = choosedDepartmentFullAddress;
    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(50.27, 30.30);
    let myOptions = {
      zoom: 10,
      center: latlng,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      },
      navigationControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    let map = new google.maps.Map(this.mapBlock, myOptions);

    if (geocoder) {
      geocoder.geocode({
        'address': googleAddress
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
            map.setCenter(results[0].geometry.location);

            var infowindow = new google.maps.InfoWindow({
              content: '<b>' + googleAddress + '</b>',
              size: new google.maps.Size(150, 50)
            });

            var marker = new google.maps.Marker({
              position: results[0].geometry.location,
              map: map,
              title: googleAddress
            });
            google.maps.event.addListener(marker, 'click', function() {
              infowindow.open(map, marker);
            });

          } else {
            console.log("No results found");
          }
        } else {
          console.log("Geocode was not successful for the following reason: " +status);
        }
      });
    }
  }

  clearDepartmentList() {
    console.log('clearDepartmentList');
    while (this.departmentList.firstChild) {
        this.departmentList.removeChild(this.departmentList.firstChild);
    }
  }

  _debounce(func, wait, immediate) {
  	let timeout;
  	return function() {
  		let context = this, args = arguments;
  		let later = function() {
  			timeout = null;
  			if (!immediate) func.apply(context, args);
  		};
  		let callNow = immediate && !timeout;
  		clearTimeout(timeout);
  		timeout = setTimeout(later, wait);
  	};
  };

  _bindEvents() {
    this.searchBarInput.addEventListener('keyup', this.displaySearchQuery);
    this.searchBarClearBtn.addEventListener('click', this.clearInput);
  }
}

DepartmentApp.defaults = {
  searchBarInput: '.search-bar__input',
  searchBarClearBtn: '.search-bar__icon-clear',
  departmentList: '.depatment-list',
  departmentBlock: '.department-block',
  mapBlock: '.department-map',
  locationEl: '#location',
  addressEl: '#address',
  emailEl: '#email',
  phoneEl: '#phone'
}

new DepartmentApp();
