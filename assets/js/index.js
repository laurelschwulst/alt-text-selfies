setupSoundToggle();
function setupSoundToggle() {
  var audio = document.getElementById("bg");
  var soundOn = document.getElementById("sound-on");
  var soundToggle = document.getElementById("sound-toggle");
  var soundToggleButton = soundToggle.querySelector("button");

  // Play sound and then navigate for 'sound-on' link
  if (soundOn) {
    soundOn.addEventListener("click", function (e) {
      console.log("playing");
      audio.play();
      soundToggleButton.classList.remove("muted");
      soundToggleButton.textContent = "Sound: on"; // Change button text
    });
  }

  if (audio.paused) {
    soundToggleButton.classList.add("muted");
    soundToggleButton.textContent = "Sound: off"; // Change button text
  }

  // Toggle sound for 'sound-toggle' link without navigating
  if (soundToggle) {
    soundToggle.addEventListener("click", function (e) {
      console.log("click sound button");
      if (audio.paused) {
        audio.play(); // Play the audio if it's paused
        soundToggleButton.classList.remove("muted");
        soundToggleButton.textContent = "Sound: on"; // Change button text
      } else {
        audio.pause(); // Pause the audio if it's playing
        soundToggleButton.classList.add("muted");
        soundToggleButton.textContent = "Sound: off"; // Change button text
      }
    });
  }
}

// mobile menu
setupMobileMenu();
function setupMobileMenu() {
  var mobileLink = document.querySelector("#mobile-ats-menu .toggle-link");
  var menuUl = document.getElementById("ats-menu");
  var menuLinks = document.querySelectorAll("#ats-menu a");

  // Check if the menu was open before
  var isMenuOpen = sessionStorage.getItem("isMenuOpen");
  if (isMenuOpen === "true") {
    mobileLink.textContent = "Close";
    menuUl.classList.add("mobile-open");
  }

  if (mobileLink) {
    mobileLink.addEventListener("click", function (e) {
      console.log("click mobile link");
      e.preventDefault();
      if (mobileLink.textContent === "Menu") {
        mobileLink.textContent = "Close";
        sessionStorage.setItem("isMenuOpen", "true");
      } else {
        mobileLink.textContent = "Menu";
        sessionStorage.setItem("isMenuOpen", "false");
      }
      menuUl.classList.toggle("mobile-open");
    });
  }

  if (menuLinks) {
    menuLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        mobileLink.textContent = "Menu";
        sessionStorage.setItem("isMenuOpen", "false");
        menuUl.classList.remove("mobile-open");
      });
    });
  }
}

// Animating stars

// Array to hold the indices of stars used
let usedIndices = [];

// Function to change stars every second
setInterval(() => {
  // Get all star elements
  let stars = document.querySelectorAll(".stars-animating .star");

  // Iterate through each star
  stars.forEach((star) => {
    // Get a random index that hasn't been used before
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * 83) + 1;
    } while (usedIndices.includes(newIndex));

    // Update the src attribute of the star
    star.src = `http://localhost:8080/assets/images/star${(
      "0" + newIndex
    ).slice(-2)}.svg`;

    // Add the index to the used indices array
    usedIndices.push(newIndex);

    // Remove the first element from used indices if it exceeds 3
    if (usedIndices.length > 3) {
      usedIndices.shift();
    }
  });
}, 1250); // Change every second

// This must run before setupSelfieFilters()
setupLateralNav();
function setupLateralNav() {
  const selfieHrefs = JSON.parse(localStorage.getItem("selfieHrefs"));
  if (!selfieHrefs) {
    return;
  }
  // if there is no lateral nav, or if the current page's href is not in selfieHrefs, clear localStorage and return
  // This prevents the selfie order from persisting longer than it's needed.
  const lateralNav = document.querySelector("nav#lateral");
  const currentHref = window.location.href;
  if (!lateralNav || !selfieHrefs.includes(currentHref)) {
    console.log("clear lateral nav localStorage");
    localStorage.removeItem("selfieHrefs");
    return;
  }
  console.log("found a filtered/sorted list of links for lateral nav");
  // get the index of the current href in selfieHrefs
  const currentIndex = selfieHrefs.indexOf(currentHref);
  // get the previous and next hrefs, looping around if necessary
  const previousHref =
    selfieHrefs[(currentIndex - 1 + selfieHrefs.length) % selfieHrefs.length];
  const nextHref = selfieHrefs[(currentIndex + 1) % selfieHrefs.length];
  // inside the lateral nav, find the previous and next links and set them to previousHref and nextHref
  const previousLink = lateralNav.querySelector(".prev-container a.prev");
  previousLink.href = previousHref;
  const nextLink = lateralNav.querySelector(".next-container a.next");
  nextLink.href = nextHref;
}

setupSelfieFilters();
function setupSelfieFilters() {
  const selfieFilterSnippet = document.getElementById("filter-snippet");
  const selfieListItems = document.querySelectorAll(".selfie-list-item");

  if (selfieFilterSnippet) {
    console.log("set up filters");
  } else {
    return;
  }

  localStorage.removeItem("selfieHrefs");

  const urlParams = new URLSearchParams(window.location.search);
  const currentSort = urlParams.get("sort") || "random";
  const currentFilter = urlParams.get("filter");

  let filterText = "";
  if (currentFilter === "chapbook") {
    filterText = "Selfies in the chapbook";
    selfieListItems.forEach(function (selfieListItem) {
      if (selfieListItem.dataset.chapbook === "true") {
        selfieListItem.classList.remove("hidden");
      } else {
        selfieListItem.classList.add("hidden");
      }
    });
  } else if (currentFilter === "audio") {
    filterText = "Selfies with audio";
    selfieListItems.forEach(function (selfieListItem) {
      if (selfieListItem.dataset.audio === "true") {
        selfieListItem.classList.remove("hidden");
      } else {
        selfieListItem.classList.add("hidden");
      }
    });
  } else {
    filterText = "All selfies";
    selfieListItems.forEach(function (selfieListItem) {
      selfieListItem.classList.remove("hidden");
    });
  }
  if (currentSort === "length") {
    filterText += ", sorted by length";
    // rearrange items by value in data-length attribute
    const selfieList = document.querySelector(".selfie-list");
    const selfieListItems = document.querySelectorAll(".selfie-list-item");
    const selfieListItemsArray = Array.from(selfieListItems);
    selfieListItemsArray.sort(function (a, b) {
      return a.dataset.length - b.dataset.length;
    });
    selfieListItemsArray.forEach(function (selfieListItem) {
      selfieList.appendChild(selfieListItem);
    });
  } else if (currentSort === "abc") {
    filterText += ", sorted in ABC order";
    // rearrange items in alphabetical order
    const selfieList = document.querySelector(".selfie-list");
    const selfieListItems = document.querySelectorAll(".selfie-list-item");
    const selfieListItemsArray = Array.from(selfieListItems);
    selfieListItemsArray.sort(function (a, b) {
      return a.dataset.title.localeCompare(b.dataset.title);
    });
    selfieListItemsArray.forEach(function (selfieListItem) {
      selfieList.appendChild(selfieListItem);
    });
  } else {
    filterText += ", in random order";
    // rearrange items in random order
    const selfieList = document.querySelector(".selfie-list");
    const selfieListItems = document.querySelectorAll(".selfie-list-item");
    const selfieListItemsArray = Array.from(selfieListItems);
    selfieListItemsArray.sort(function (a, b) {
      return 0.5 - Math.random();
    });
    selfieListItemsArray.forEach(function (selfieListItem) {
      selfieList.appendChild(selfieListItem);
    });
  }

  if (currentSort || currentFilter) {
    const selfieHrefs = Array.from(
      document.querySelectorAll(".selfie-list-item")
    )
      .filter((selfieListItem) => !selfieListItem.classList.contains("hidden"))
      .map((selfieListItem) => selfieListItem.querySelector("a").href);
    localStorage.setItem("selfieHrefs", JSON.stringify(selfieHrefs)); // save selfieHrefs to localStorage
  }

  const { createApp, ref } = Vue;
  createApp({
    data() {
      return {
        filterText: filterText,
        newSort: currentSort,
        newFilter: currentFilter,
        filterModalIsOpen: false,
      };
    },
    methods: {
      applySort: function (sort) {
        this.newSort = sort;
        this.redirectToNewUrl();
      },
      applyFilter: function (filter) {
        this.newFilter = filter;
        this.redirectToNewUrl();
      },
      redirectToNewUrl: function () {
        const params = [];
        if (this.newSort) params.push(`sort=${this.newSort}`);
        if (this.newFilter) params.push(`filter=${this.newFilter}`);
        const paramString = params.length ? `?${params.join("&")}` : "";
        const baseUrl = window.location.origin + window.location.pathname;
        window.location.href = baseUrl + paramString;
      },
      openFilterModal: function () {
        this.filterModalIsOpen = true;
      },
      closeFilterModal: function () {
        if (this.newSort !== currentSort || this.newFilter !== currentFilter) {
          this.redirectToNewUrl();
        } else {
          this.filterModalIsOpen = false;
        }
      },
    },
    // listen for escape key
    mounted() {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.closeFilterModal();
        }
      });
    },
  }).mount("#filter-snippet");
}

// audio button for individual selfie
setupSelfieAudio();
async function setupSelfieAudio() {
  var audio = document.getElementById("selfie");
  var button = document.querySelector(".selfie-audio");

  const selfieName = audio.dataset.selfieName
  const transcriptData = await fetch(`/assets/selfie-transcripts/${selfieName}.json`).then(response => response.json())
  console.log(transcriptData)

  if (button) {
    button.addEventListener("click", function () {
      if (audio.paused) {
        audio.play();
        if (transcriptData) render(transcriptData)
        button.innerHTML = "Pause";
        $("audio#bg").animate({volume: 0.3}, 1000);
      } else {
        audio.pause();
        button.innerHTML = "Listen";
        $("audio#bg").animate({volume: 1}, 1000);
      }
    });

    audio.addEventListener("ended", function () {
      button.innerHTML = "Listen";
      $("audio#bg").animate({volume: 1}, 1000);
    });
  }

  // when page loads, check if bg audio's volume is reduced, and restore it if so
  if ($("audio#bg").prop("volume") < 1) {
    $("audio#bg").animate({volume: 1}, 1000);
  }

  // copied from https://github.com/lowerquality/gentle/blob/master/www/view_alignment.html
  var $trans = document.getElementById("transcript");
  var wds = [];
  var cur_wd;

  // add span for each word inside a <p> inside $trans
  const paragraphs = $trans.querySelectorAll("p");
  const spans = [];
  paragraphs.forEach((p) => {
    const words = p.textContent.split(" ");
    p.innerHTML = "";
    words.forEach((word) => {
      const span = document.createElement("span");
      span.textContent = word + " ";
      p.appendChild(span);
      const space = document.createTextNode(" ");
      p.appendChild(space);
      spans.push(span);
    });
  });
  console.log(spans);

  function render(ret) {
      wds = ret['words'] || [];
      transcript = ret['transcript'];

      // $trans.innerHTML = '';

      var currentOffset = 0;
      let spanIndex = 0;

      console.log(wds);

      wds.forEach(function(wd) {
        // if(wd.case == 'not-found-in-transcript') {
        //     // TODO: show phonemes somewhere
        //     var txt = ' ' + wd.word;
        //     var $plaintext = document.createTextNode(txt);
        //     $trans.appendChild($plaintext);
        //     return;
        // }

        // // Add non-linked text
        // if(wd.startOffset > currentOffset) {
        //     var txt = transcript.slice(currentOffset, wd.startOffset);
        //     var $plaintext = document.createTextNode(txt);
        //     $trans.appendChild($plaintext);
        //     currentOffset = wd.startOffset;
        // }

        var txt = transcript.slice(wd.startOffset, wd.endOffset);
        // var $wd = document.createElement('span');
        // var $wdText = document.createTextNode(txt);
        // $wd.appendChild($wdText);

        // search through spans from index spanIndex to find the first span whose text content is the same as txt and set wd.$div to that span
        let tempSpanIndex = spanIndex;
        while (tempSpanIndex < spans.length) {
          const currentSpan = spans[tempSpanIndex];
          const spanText = currentSpan.innerText.trim();
          if (spanText.includes(txt)) {
            wd.$div = currentSpan;
            const txtLength = txt.length;
            if (spanText.length === txtLength) {
              spanIndex = tempSpanIndex + 1;
            }
            break;
          }
          tempSpanIndex++;
        }

        
        // const currentSpan = spans[spanIndex];
        // if (currentSpan) {
        //   console.log(currentSpan.innerText.trim(), txt);
        //   if (currentSpan.innerText.trim() === txt) {
        //     wd.$div = currentSpan;
        //     spanIndex++
        //   }
        // }

        // wd.$div = $wd;
        // if(wd.start !== undefined) {
        //   $wd.className = 'success';
        // }
        // $trans.appendChild($wd);
        currentOffset = wd.endOffset;
      });

      // var txt = transcript.slice(currentOffset, transcript.length);
      // var $plaintext = document.createTextNode(txt);
      // $trans.appendChild($plaintext);
      // currentOffset = transcript.length;
  }

  var $a = audio;
  function highlight_word() {
    var t = $a.currentTime;
    // XXX: O(N); use binary search
    var hits = wds.filter(function(x) {
        return (t - x.start) > 0.01 && (x.end - t) > 0.01;
    }, wds);
    var next_wd = hits[hits.length - 1];

    if(cur_wd != next_wd) {
        var active = document.querySelectorAll('.active');
        for(var i = 0; i < active.length; i++) {
            active[i].classList.remove('active');
        }
        if(next_wd && next_wd.$div) {
            next_wd.$div.classList.add('active');
        }
    }
    cur_wd = next_wd;

    window.requestAnimationFrame(highlight_word);
  }
  window.requestAnimationFrame(highlight_word);
}
