//constants for the api key, the search button and the input field where the user types
const api_key = "AIzaSyDdkUJrGPPVWMRg-enDhs2Y_2xvkvQT6lI";
const search_button = document.getElementById("search-button");
const search_input = document.getElementById("search-input");
const displayArea = document.getElementById("result");

//event listeners for the search button and the enter press
search_button.addEventListener("click", search);
document.addEventListener("keypress", function (e) {
  if (event.keyCode == 13) {
    search(e);
  }
})

//saves the value of the search query, validates it and starts the fetch process
function search(e) {
  e.preventDefault();
  if (search_input.value != "") {
    const raw = search_input.value.toLowerCase();
    const query = raw.replace(/\s/,"+");
    asyncCall(query);
  } else {
    alert("Please type in your search request")
  }
}

//makes the api call to google
async function asyncCall(query) {
  try {
    //axios is a open source js file which makes get request very easy
    let data = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}s&key=${api_key}`);
    display(data); //loads in the data as cards into the dom
  } catch (err) {
    alert("Something went wrong. Please try again"); // If something goes wrong with the call, this is displayed
  }
}

//makes an array of processed items to diplay for the api data
function display(data) {
  dataArray = data.data.items
  let processedData = [];
  for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i].volumeInfo.authors == undefined) { dataArray[i].volumeInfo.authors = ["#Missing Entry#"]}
    if (dataArray[i].volumeInfo.publisher == undefined) { dataArray[i].volumeInfo.publisher = "#Missing Entry#" }
    
    const element = `
      <div class="uk-card uk-card-default uk-card-hover uk-grid-collapse uk-child-width-1-2@s" uk-grid>
        <div class="uk-card-media-left uk-cover-container">
          <img src="${dataArray[i].volumeInfo.imageLinks.thumbnail}" alt="The image to ${dataArray[i].volumeInfo.title} by ${dataArray[i].volumeInfo.authors[0]}" uk-cover>
          <canvas width="600" height="400"></canvas>
        </div>
        <div>
          <div class="uk-card-body">
            <h3 class="uk-card-title">${dataArray[i].volumeInfo.title}</h3>
            <p>Written by ${dataArray[i].volumeInfo.authors[0]}</p>
            <p>Published by ${dataArray[i].volumeInfo.publisher}</p>
            <a href="${dataArray[i].volumeInfo.previewLink}" class="uk-button uk-button-primary">Further Info</a>
          </div>
        </div>
      </div>
    `;
    processedData.push(element);
  }
  displayArea.innerHTML = ""; //deletes the old search results
  displayArea.innerHTML = processedData.join("");
}
