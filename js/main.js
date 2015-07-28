!function(){
    var width = 960*2,
    height = 500*2;

var projection = d3.geo.orthographic()
    .scale(248)
    .clipAngle(90);

var canvas = d3.select("body").append("canvas")
    .attr("width", width)
    .attr("height", height)
    .style("width", width/2 + 'px')
    .style("height", height/2 + 'px');

var c = canvas.node().getContext("2d");
c.scale(2,2);
var path = d3.geo.path()
    .projection(projection)
    .context(c);

var title = d3.select("h1");

queue()
    .defer(d3.json, "data/world-110m.json")
    .defer(d3.tsv, "data/world-country-names.tsv")
    .await(ready);

function ready(error, world, names) {
  if (error) throw error;

  var globe = {type: "Sphere"},
      land = topojson.feature(world, world.objects.land),
      countries = topojson.feature(world, world.objects.countries).features,
      borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
      n = countries.length;

  countries = countries.filter(function(d) {
    return names.some(function(n) {
      if (d.id == n.id) return d.name = n.name;
    });
  }).sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });
  
  
  
  
  if (annyang) {
    annyang.debug(true);

    // Let's define a command.
    var commands = {
      "travel to *place":travel,
      "take me to *place":travel,
      "go to *place":travel
    };

    // Add our commands to annyang
    annyang.addCommands(commands);

    // Start listening.
    annyang.start();
  }
  
  
  render();
  
  function travel(place){
    console.log('Going to: ' + place);
    
    countries.forEach(function(country, i){
      if(country.name.indexOf(place) > -1){
        console.log('Match: ' + country.name);
        speakInfo(country.name);
        transition(i);
      }
    });
  }
  
  function speakInfo(place){
    var options = {
      action: 'query', 
      prop: 'extracts', 
      titles: place,
      exintro:'',
      explaintext:''
    };
    
    MediaWikiJS('https://en.wikipedia.org', options, function (data) {
        var pages = data.query.pages;
        var extract = pages[Object.keys(pages)[0]].extract;
        extract = extract.replace(/ \([^()]*\)/gm, '').replace(/(\.|\n).*/gm,'');
        console.log('Extract: ' + extract);
        annyang && annyang.pause();
      
      
        var msg = new SpeechSynthesisUtterance(extract);
        msg.onend = function(e){
          console.log('Finished in ' + e.elapsedTime + ' seconds.');
          annyang && annyang.resume();
        };
        window.speechSynthesis.speak(msg);
    });
  };
  
  function render(i){
    c.clearRect(0, 0, width, height);
    c.fillStyle = "#bbb", c.beginPath(), path(land), c.fill();
    if(i !== undefined) c.fillStyle = "#f00", c.beginPath(), path(countries[i]), c.fill();
    c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
    c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
  }

  function transition(i) {
    d3.transition()
        .duration(1250)
        .each("start", function() {
          title.text(countries[i].name);
        })
        .tween("rotate", function() {
          var p = d3.geo.centroid(countries[i]),
              r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
          return function(t) {
            projection.rotate(r(t));
            render(i);
          };
        });
  }
  
}
}()