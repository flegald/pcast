$(document).ready(function(){

  const searchButt = $("#searchButt");
  $("#main").hide();
  $("#eps").hide();
  $("#reload").hide()

  function getItunesId(term){
    $.get("https://itunes.apple.com/search?media=podcast&podcast=podcastAuthor&term=" + term, function(data){
      let podcasts = JSON.parse(data)["results"];
      for (i=0;i<podcasts.length;i++){
        $("#showList").append('<li><img src="' + podcasts[i]["artworkUrl100"] +  '" id="' + podcasts[i]["feedUrl"] + '" class="showEps"></li>')
      }
    })
  }

  function getFeedXML(xmlLink){
    console.log(xmlLink)
    $.ajax({
      type: "GET",
      url: xmlLink,
      crossDomain: true,
      success: function(data){
        let chan = data.getElementsByTagName("channel");
        let chanchild = chan.item("item");
        let chanchildchild = chanchild.children
        if (chanchildchild.length < 50) {
          listLength = chanchildchild.length;
        } else {
          listLength = 50;
        }
        for (i=0;i<listLength;i++){
          if (chanchildchild[i].tagName == "item"){
            let enclosure = chanchildchild[i].getElementsByTagName("enclosure");
            let episode = enclosure[0]
            let episode_url = episode.attributes["url"].value
            let title = chanchildchild[i].getElementsByTagName("title")[0].innerHTML
            $("#epList").append('<li><a href="' + episode_url + '" target="_blank">' + title + '</a>')
          }
        }
      }
    })
    }

  searchButt.on("click", function(){
    $("#showList").html("");
    $("#reload").fadeIn()
    $(".search").fadeOut();
    let query = encodeURIComponent($("#searchInput").val());
    getItunesId(query);
    $("#main").fadeIn();
  })

  $(document).on("click", ".showEps", function(){
    $("#main").fadeOut();
    $("#epList").html("");
    let feedUrl = $(this).attr('id');
    getFeedXML(feedUrl);
    $("#eps").fadeIn();
  })

  $("#reload").on("click", function(){
    location.reload();
  })


})
