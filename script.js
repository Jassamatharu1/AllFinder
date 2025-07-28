const searchBarInput = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");
const newsTab = document.getElementById("news-tab");
const imagesTab = document.getElementById("images-tab");
const wikipediaTab = document.getElementById("wikipedia-tab");

function fetchWikipedia(query) {

  // console.log(`Fetching Wikipedia results for: ${query}`);
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${query}`;

  fetch(url)
    .then((response) => response.json())

    .then((data) => {
      // console.log(data);
      console.log("Wikipedia Results:", data.query.search);

      wikipediaTab.innerHTML = "";

      data.query.search.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("result-item");
        div.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.snippet}</p>
        <a href="https://en.wikipedia.org/?curid=${item.pageid}" target="_blank">Read more</a>
        `;
        wikipediaTab.appendChild(div);
      });
    })
    .catch((error) => {
      console.error("Error fetching Wikipedia data:", error);
    });
}


function fetchNews(query) {
  const url = `https://newsdata.io/api/1/news?apikey=pub_d3eba136c02d4df3a67d3295d128f8b1&q=${query}&language=en`;

  fetch(url)
    .then((response) => response.json())

    .then((data) => {
      // console.log(data);
      // console.log("funtion working");
      console.log("News Result :", data.results);

      newsTab.innerHTML = "";

      data.results.forEach((item) => {

        const div = document.createElement("div");
        div.classList.add("result-item");
        div.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <a href="${item.link}" target="_blank">Read more</a>
      `;
        newsTab.appendChild(div);
      });
    })
    .catch((error) => {
      console.log("Error fetching news data:", error);

    });
}


function fetchImages(query) {
  const url = `https://api.pexels.com/v1/search?query=${query}&per_page=12`;


  fetch(url, {
    headers: {
      Authorization: "Z3UPG0zWJf5iibhIZiOMpaYL2aVXOKdFiYa6UGWuOzZCqaua1EQKjYDm"
    }
  })

    .then((response) => response.json())

    .then((data) => {
      console.log("Image", data.photos);

      imagesTab.innerHTML = "";

      data.photos.forEach(photos => {
        const div = document.createElement("div");
        div.classList.add("result-item");
        div.innerHTML = `
      <img src="${photos.src.medium}" alt="${photos.alt}" style="max-width: 100%; border-radius: 5px;" />
          <p>Photographer: <a href="${photos.photographer_url}" target="_blank">${photos.photographer}</a></p>
      `
        imagesTab.appendChild(div);
      });
    })

    .catch((error) => {
      console.log("Error fetching news data:", error);
    });

}


tabs.forEach(tab => {

  tab.addEventListener("click", () => {

    tabs.forEach(tabElement => {
      tabElement.classList.remove("active");
      console.log("tabs active remove");
    });
    tabContents.forEach(tabElementContent => {
      tabElementContent.classList.remove("active");
      console.log("tabs content active remove");
    });

    tab.classList.add("active")

    const tabId = tab.getAttribute("data-tab");
    document.getElementById(tabId).classList.add("active");

  });

});




searchButton.addEventListener("click", () => {
  searchPerform();
});


searchBarInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchPerform();
  }
});

function searchPerform() {
  const query = searchBarInput.value.trim();
  if (!query) {
    alert("Please enter a search term.");
    return;
  }

  wikipediaTab.innerHTML = newsTab.innerHTML = imagesTab.innerHTML = "<p>Loading...</p>";

  Promise.all([
    fetchWikipedia(query),
    fetchNews(query),
    fetchImages(query)
  ])
  .then(() => {
    console.log("All results loaded!");
  })
  .catch(error => {
    console.error("Error fetching one or more APIs:", error);
  });
}







