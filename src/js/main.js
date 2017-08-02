/*
 * Third party
 */



/*
 * Custom
 */
 //
 // var searchBarInput = $("#searchBarInput");
 // var clearSearchBtn = $(".clearSearchBarField");
 //
 // $(document).ready(function() {
 //
 // 	searchBarInput.keyup(function() {
 // 		if( $(this).val().length === 0 ) {
 // 			clearSearchBtn.hide()
 // 		} else {
 // 			clearSearchBtn.show()
 // 		}
 // 	});
 //
 // });
 //
 // function resetInput() {
 // 	clearSearchBtn.hide();
 // 	searchBarInput.val('').focus();
 // }

let searchBarInput = document.querySelector('#searchBarInput');
let searchBarClearBtn = document.querySelector('.search-bar__icon-clear');

searchBarInput.addEventListener('keyup', displayIconClear);
searchBarClearBtn.addEventListener('click', clearInput);

function displayIconClear(e) {
  if (searchBarInput.value.length === 0) {
    searchBarClearBtn.classList.add('search-bar__icon-clear--display-none');
  } else {
    searchBarClearBtn.classList.remove('search-bar__icon-clear--display-none');
  }
}

function clearInput() {
  searchBarClearBtn.classList.add('search-bar__icon-clear--display-none');
  searchBarInput.value = '';
  searchBarInput.focus();
}
