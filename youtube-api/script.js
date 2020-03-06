/**
   * Sample JavaScript code for youtube.search.list
   * See instructions for running APIs Explorer code samples locally:
   * https://developers.google.com/explorer-help/guides/code_samples#javascript
   */

  function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.force-ssl"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  function loadClient() {
    gapi.client.setApiKey("AIzaSyDvykc4-5gdVYpFHCbXJUbZlogbipWhN3M");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute() {
    return gapi.client.youtube.search.list({
      "part": "snippet",
      "location": "21.5922529,-158.1147114",
      "locationRadius": "10mi",
      "q": "surfing",
      "type": "video"
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                load_links(response);
                console.log(response)
              },
              function(err) { console.error("Execute error", err); });
  }
  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "992905496519-0827e2lhq9ri48u2s5r0ipq8nhbtish1.apps.googleusercontent.com"});
  });

  function load_links (response){
    let link_prefix = "https://www.youtube.com/watch?v="
    let links= "";
    let array = response.result.items;
    for (let i = 0;i<array.length;i++){
        links += `<a href =${link_prefix+array[i].id.videoId} target="_blank">${array[i].snippet.title}</a><br></br>`
    }
    document.getElementById("content").innerHTML += links;
  }
/*
  function (category){
      let category_list = {
        "Autos":2,
        "Vehicles":2,
        "Film":1,
        "Animation":1,
        "Music":10,
        "Pets":15,
        "Animals":15,
        "Sports":17,
        "Short Movies":18,
        19 : "Travel & Events",
        20 : "Gaming"
        21 : "Videoblogging"
        22 : "People & Blogs"
        23 : "Comedy"
        24 : "Entertainment"
        25 : "News & Politics"
        26 : "Howto & Style"
        27 : "Education"
        28 : "Science & Technology"
        29 : "Nonprofits & Activism"
        30 : "Movies"
        31 : "Anime/Animation"
        32 : "Action/Adventure"
        33 : "Classics"
        34 : "Comedy"
        35 : "Documentary"
        36 : "Drama"
        37 : "Family"
        38 : "Foreign"
        39 : "Horror"
        40 : "Sci-Fi"
        40:  "Fantasy"
        41 : "Thriller"
        42 : "Shorts"
        43 : "Shows"
        44 : "Trailers"
      }
  }*/