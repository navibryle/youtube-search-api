var client_id_user = "992905496519-0827e2lhq9ri48u2s5r0ipq8nhbtish1.apps.googleusercontent.com";
var api_key_user = "AIzaSyDvykc4-5gdVYpFHCbXJUbZlogbipWhN3M";
function authenticate() {
  document.getElementById("auth-load").setAttribute("class","btn btn-lg btn-primary fields")
  return gapi.auth2.getAuthInstance()
      .signIn({scope: "https://www.googleapis.com/auth/youtube.force-ssl"})
      .then(function() { console.log("Sign-in successful"); },
            function(err) { console.error("Error signing in", err); });
}
function loadClient() {
  gapi.client.setApiKey(api_key_user);
  return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function proc_query(query) {
  reset();
  var query = {
    "part": "snippet",
    "type": "video"
  };
  return set_query(query).then((response)=>{
    return gapi.client.youtube.search.list(response);})
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                load_links(response);
              },
              function(err) { alert("Execute error", err); }).catch((err)=>{alert(err);})}
gapi.load("client:auth2", function() {
  gapi.auth2.init({client_id: client_id_user});
});
function set_query(query){
  //this function will mutate query
  return new Promise((resolve,reject) => {
  let parent = document.getElementById("input-group")
  for (let i = parent.firstChild;i !=null;i = i.nextSibling){
    if (i.value != undefined && i.value != ""){
      if (i.name === "location"){
        set_location().then((response) => {
          query["locationRadius"] = "1500m";
          query["location"] = response;
        }).catch((err) => {alert(err)})
      }else{
        query[i.name] = i.value;
      }
      
    } 
  }
  resolve(query);
})

}
function load_links (response){
  let link_prefix = "https://www.youtube.com/watch?v="
  let links= "";
  let array = response.result.items;
  for (let i = 0;i<array.length;i++){
      links += `<div id =${i}><button class ="del-button" style="text-align: center; width: 30px;" type="button" onclick="del_link(${i})" class="btn btn-lg btn-primary fields">X</button>`+`<a id=link-cont data-videoid="${array[i].id.videoId}" data-channelid="${array[i].snippet.channelId}" href=${link_prefix+array[i].id.videoId} target="_blank">${array[i].snippet.title}</a><br></br></div>`
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
    }).catch((err) => {
      alert(err)
      reject("Location error");
    })
  })
}

  
function get_keyword(){
  console.log(document.getElementById("keyword"));
  return document.getElementById("keyword").value;
}
function clear_results(){
  reset();
  document.getElementById("content").innerHTML = "";
}
function del_link(id){
  reset();
  document.getElementById(id).remove()
}
function insert_comment(vid_id,chan_id,comm) {
  return gapi.client.youtube.commentThreads.insert({
    "part": "snippet",
    "resource": {
      "snippet": {
        "videoId": `${vid_id}`,
        "channelId": `${chan_id}`,
        "topLevelComment": {
          "snippet": {
            "textOriginal": `${comm}`
          }
        }
      }
    }
  })
      .then(function(response) {
              document.getElementById("comment-result").innerHTML = "All comments have been posted";
            },
            function(err) { console.error("Execute error", err); });
}
gapi.load("client:auth2", function() {
  gapi.auth2.init({client_id: client_id_user});
});
function insert_all_comments(){
  
  let parent = document.getElementById("content")
  let comment = document.getElementById("comment").value
  for (let i = parent.firstChild; i != null; i = i.nextSibling){
    let node = i.firstChild.nextSibling;
    if (node.id === "link-cont"){
      insert_comment(node.getAttribute('data-videoid'),node.getAttribute('data-channelid'),comment);
    }
  }
}
function reset(){
  document.getElementById("comment-result").innerHTML = "";
}