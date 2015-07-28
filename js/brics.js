var width = 960,
    height = 960;

var projection = d3.geo.orthographic()
    .scale(window.innerWidth > 1024 && window.innerHeight > 700 ? 450 : 300)
    .center([0, window.innerWidth < 1024 && window.innerHeight > 700  ? 20 : 10])
    .clipAngle(90);

$(window).resize(function(){
  projection.scale(window.innerWidth > 1024 && window.innerHeight > 700 ? 450 : 300);
});

var canvas = d3.select("body").append("canvas")
    .attr("width", width)
    .attr("height", height);

var c = canvas.node().getContext("2d");

var path = d3.geo.path()
    .projection(projection)
    .context(c);

var title = d3.select("#currTitle");

var names = [{"id":"76","name":"Brazil"},{"id":"643","name":"Russian Federation"},{"id":"356","name":"India"},{"id":"156","name":"China"},{"id":"710","name":"South Africa"}];

ready('', world, names);

function ready(error, world, names) {
  var globe = {type: "Sphere"},
      land = topojson.feature(world, world.objects.land),
      countries = topojson.feature(world, world.objects.countries).features,
      borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
      i = -1,
      n = names.length;

  countries = countries.filter(function(d) {
    return names.some(function(n) {
      if (d.id == n.id) return d.name = n.name;
    });
  }).sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });
    
    var scrollOffset = '35%';
    
    new Waypoint({
      element: $('h1'),
      handler: function(direction) {
        transition()
      }
    });
    
    new Waypoint({
      element: $('#brazil'),
      handler: function(direction) {
        transition('Brazil')
      },
        offset:scrollOffset
    });
    
    new Waypoint({
      element: $('#russia'),
      handler: function(direction) {
        transition('Russian Federation')
      },
        offset:scrollOffset
    });
    
    new Waypoint({
      element: $('#india'),
      handler: function(direction) {
        transition('India')
      },
        offset:scrollOffset
    });
    
    new Waypoint({
      element: $('#china'),
      handler: function(direction) {
        transition('China')
      },
        offset:scrollOffset
    });
    
    new Waypoint({
      element: $('#southAfrica'),
      handler: function(direction) {
        transition('South Africa')
      },
        offset:scrollOffset
    });

    c.clearRect(0, 0, width, height);
            c.fillStyle = "#bbb", c.beginPath(), path(land), c.fill();
            c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
            c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
  function transition(countryName) {
      var thisCountry = countries.filter(function(country){return country.name === countryName})[0];
      console.log(thisCountry,thisCountry ? d3.geo.centroid(thisCountry) : [0,0]);

    d3.transition()
        .duration(1250)
        .tween("rotate", function() {
          var p = thisCountry ? d3.geo.centroid(thisCountry) : [0,0],
              r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
          return function(t) {
            projection.rotate(r(t));
            c.clearRect(0, 0, width, height);
            c.fillStyle = "#bbb", c.beginPath(), path(land), c.fill();
              if(thisCountry)
                c.fillStyle = "#f00", c.beginPath(), path(thisCountry), c.fill();
            c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
            c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
          };
        });
  }
}