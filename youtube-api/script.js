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
  function proc_query(query) {
    var query = {
      "part": "snippet",
      "type": "video"
    };
    
    return set_query(query).then((response)=>{
      console.log(response);
      return gapi.client.youtube.search.list(query);})
          .then(function(response) {
                  console.log("REEEEEEE",response)
                  // Handle the results here (response.result has the parsed body).
                  load_links(response);
                  
                },
                function(err) { alert("Execute error", err); }).catch((err)=>{alert(err);})}
  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "992905496519-0827e2lhq9ri48u2s5r0ipq8nhbtish1.apps.googleusercontent.com"});
  });
  function set_query(query){
    //this function will mutate query
    return new Promise((resolve,reject) => {
    let parent = document.getElementById("input-group")
    for (let i = parent.firstChild;i !=null;i = i.nextSibling){
      if (i.value != undefined && i.value != ""){
        query[i.name] = i.value;
      }
    }
    if(query["location"] != null && query["location"] != ""){
      set_location().then((response) => {
        query["location"] = response;
      }).catch((err) => {alert(err)})
    }
    resolve(query);
  })
  
}
  function load_links (response){
    console.log("links");
    let link_prefix = "https://www.youtube.com/watch?v="
    let links= "";
    let array = response.result.items;
    for (let i = 0;i<array.length;i++){
        links += '<button class ="del-button" style="text-align: center; width: 30px;" type="button" onclick="del_link(this)" class="btn btn-lg btn-primary fields">X</button>'+`<a href=${link_prefix+array[i].id.videoId} target="_blank">${array[i].snippet.title}</a><br></br>`
    }
    document.getElementById("content").innerHTML += links;
  }
  function set_location(){//this is using open cage api
    /* IMPORTANT THIS FUNCTION WILL GET THE FIRST LAT AND  LONG THIS API OUTPUTS. THERE ARE MULTIPLE LAT'S AND
    LONGS DUE TO PLACES HAVING THE SAME NAME*/
    //this function will return longitude and lattitude
    //api_link: https://opencagedata.com/api
    return new Promise((resolve,reject) =>{
    let location = document.getElementById("location").value;
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${location}&key=c0633f4db3984c34b3b33abb33d6f3c3`).then(
      (response) => {
        return response.json();
      }
    ).then(
      (data)=>{
        resolve(`${data.results[1].geometry.lat},${data.results[1].geometry.lng}`);
      }).catch((err) => {alert(err)})
    reject("Location error");
    })
    }
  
    
  function get_keyword(){
    console.log(document.getElementById("keyword"));
    return document.getElementById("keyword").value;
  }
  function clear_results(){
    document.getElementById("content").innerHTML = "";
  }
  function del_link(node){
    node.nextSibling.remove();
    node.remove();
  }