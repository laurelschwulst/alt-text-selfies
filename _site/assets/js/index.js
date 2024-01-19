setupSoundToggle();
function setupSoundToggle() {
    var audio = document.getElementById('bg');
    var soundOn = document.getElementById('sound-on');
    var soundToggle = document.getElementById('sound-toggle');
    var soundToggleButton = soundToggle.querySelector('button');
    
    // Play sound and then navigate for 'sound-on' link
    if (soundOn) {
        soundOn.addEventListener('click', function(e) {
            console.log('playing');
            audio.play();
            soundToggleButton.classList.remove('muted')
        });
    }

    if (audio.paused) {
        soundToggleButton.classList.add('muted')
    }
    
    // Toggle sound for 'sound-toggle' link without navigating
    if (soundToggle) {
        soundToggle.addEventListener('click', function(e) {
            console.log('click sound button');
            if (audio.paused) {
                audio.play(); // Play the audio if it's paused
                soundToggleButton.classList.remove('muted')
            } else {
                audio.pause(); // Pause the audio if it's playing
                soundToggleButton.classList.add('muted')
            }
        });
    }
}

// audio button for individual selfie
setupSelfieAudio();
function setupSelfieAudio() {
    var audio = document.getElementById("selfie");
    var button = document.querySelector(".selfie-audio");

    if (button) {
        button.addEventListener("click", function() {
            if (audio.paused) {
                audio.play();
                button.innerHTML = "Pause";
            } else {
                audio.pause();
                button.innerHTML = "Listen";
            }
        });
    }
}

// mobile menu
setupMobileMenu();
function setupMobileMenu() {
    var mobileLink = document.querySelector("#mobile-ats-menu .toggle-link");
    var menuUl = document.getElementById("ats-menu");
    var closeLink = document.querySelector("#ats-menu .close-menu");

    if (mobileLink) {
        mobileLink.addEventListener("click", function(e) {
            console.log('click mobile link');
            e.preventDefault();
            mobileLink.style.display = "none";
            menuUl.classList.add('mobile-open')
            // menuUl.style.display = "block";
        });
    }

    if (closeLink) {
        closeLink.addEventListener("click", function(e) {
            e.preventDefault();
            mobileLink.style.display = "inline-block";
            menuUl.classList.remove('mobile-open')
            // menuUl.style.display = "none";
        });
    }
}

// This must run before setupSelfieFilters()
setupLateralNav();
function setupLateralNav() {
    const selfieHrefs = JSON.parse(localStorage.getItem('selfieHrefs'));
    if (!selfieHrefs) {
        return
    }
    // if there is no lateral nav, or if the current page's href is not in selfieHrefs, clear localStorage and return
    // This prevents the selfie order from persisting longer than it's needed.
    const lateralNav = document.querySelector('nav#lateral');
    const currentHref = window.location.href;
    if (!lateralNav || !selfieHrefs.includes(currentHref)) {
        console.log('clear lateral nav localStorage')
        localStorage.removeItem('selfieHrefs')
        return
    }
    console.log('found a filtered/sorted list of links for lateral nav')
    // get the index of the current href in selfieHrefs
    const currentIndex = selfieHrefs.indexOf(currentHref);
    // get the previous and next hrefs, looping around if necessary
    const previousHref = selfieHrefs[(currentIndex - 1 + selfieHrefs.length) % selfieHrefs.length];
    const nextHref = selfieHrefs[(currentIndex + 1) % selfieHrefs.length];
    // inside the lateral nav, find the previous and next links and set them to previousHref and nextHref
    const previousLink = lateralNav.querySelector('.prev-container a.prev');
    previousLink.href = previousHref;
    const nextLink = lateralNav.querySelector('.next-container a.next');
    nextLink.href = nextHref;
}

setupSelfieFilters();
function setupSelfieFilters() {
    const selfieFilterSnippet = document.getElementById('filter-snippet');
    const selfieListItems = document.querySelectorAll('.selfie-list-item');

    if (selfieFilterSnippet) {
        console.log('set up filters')
    } else {
        return
    }

    localStorage.removeItem('selfieHrefs')

    const urlParams = new URLSearchParams(window.location.search);
    const currentSort = urlParams.get('sort');
    const currentFilter = urlParams.get('filter');

    let filterText = '';
    if (currentFilter === 'chapbook') {
        filterText = 'Selfies in the chapbook, '
        selfieListItems.forEach(function(selfieListItem) {
            if (selfieListItem.dataset.chapbook === 'true') {
                selfieListItem.classList.remove('hidden')
            } else {
                selfieListItem.classList.add('hidden')  
            }
        });
    } else if (currentFilter === 'audio') {
        filterText = 'Selfies with audio, '
        selfieListItems.forEach(function(selfieListItem) {
            if (selfieListItem.dataset.audio === 'true') {
                selfieListItem.classList.remove('hidden')
            } else {
                selfieListItem.classList.add('hidden')
            }
        });
    } else {
        filterText = 'All selfies, '
        selfieListItems.forEach(function(selfieListItem) {
            selfieListItem.classList.remove('hidden')
        });
    }
    if (currentSort === 'length') {
        filterText += 'sorted by length'
        // rearrange items by value in data-length attribute
        const selfieList = document.querySelector('.selfie-list');
        const selfieListItems = document.querySelectorAll('.selfie-list-item');
        const selfieListItemsArray = Array.from(selfieListItems);
        selfieListItemsArray.sort(function(a, b) {
            return a.dataset.length - b.dataset.length;
        });
        selfieListItemsArray.forEach(function(selfieListItem) {
            selfieList.appendChild(selfieListItem);
        });
    } else if (currentSort === 'random') {
        filterText += 'in random order'
        // rearrange items in random order
        const selfieList = document.querySelector('.selfie-list');
        const selfieListItems = document.querySelectorAll('.selfie-list-item');
        const selfieListItemsArray = Array.from(selfieListItems);
        selfieListItemsArray.sort(function(a, b) {
            return 0.5 - Math.random();
        });
        selfieListItemsArray.forEach(function(selfieListItem) {
            selfieList.appendChild(selfieListItem);
        });
    } else {
        filterText += 'sorted in ABC order'
    }

    if (currentSort || currentFilter) {
        const selfieHrefs = Array.from(document.querySelectorAll('.selfie-list-item')).filter(selfieListItem => !selfieListItem.classList.contains('hidden')).map((selfieListItem) => selfieListItem.querySelector('a').href)
        localStorage.setItem('selfieHrefs', JSON.stringify(selfieHrefs)) // save selfieHrefs to localStorage
    }

    const { createApp, ref } = Vue
    createApp({
        data() {
        return {
            filterText: filterText,
            newSort: currentSort,
            newFilter: currentFilter,
            filterModalIsOpen: false,
        }
        },
        methods: {
        applySort: function(sort) {
            this.newSort = sort
            this.redirectToNewUrl()
        },
        applyFilter: function(filter) {
            this.newFilter = filter
            this.redirectToNewUrl()
        },
        redirectToNewUrl: function() {
            const params = []
            if (this.newSort) params.push(`sort=${this.newSort}`)
            if (this.newFilter) params.push(`filter=${this.newFilter}`)
            const paramString = params.length ? `?${params.join('&')}` : ''
            const baseUrl = window.location.origin + window.location.pathname
            window.location.href = baseUrl + paramString
        },
        openFilterModal: function() {
            this.filterModalIsOpen = true
        },
        closeFilterModal: function() {
            if (this.newSort !== currentSort || this.newFilter !== currentFilter) {
            this.redirectToNewUrl()
            } else {
            this.filterModalIsOpen = false
            }
        }
        },
        // listen for escape key
        mounted() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                this.closeFilterModal()
                }
            })
        },
    }).mount('#filter-snippet')
}