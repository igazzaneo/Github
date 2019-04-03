function initMap() {

  var roads = L.gridLayer.googleMutant({
    type: 'roadmap'	// valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
  })

  var satellite = L.gridLayer.googleMutant({
     type: 'satellite'	// valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
  })

  var terrain = L.gridLayer.googleMutant({
     type: 'terrain'	// valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
  })

  var hybrid = L.gridLayer.googleMutant({
     type: 'hybrid'	// valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
  })

  var options = {
    icon: 'fas fa-hiking',
    /*iconShape: 'marker',*/
    borderColor: '#000000',
    borderWidth: 2,
    iconSize: [45, 45],
    /*popupAnchor: [100, -10],*/
    popupAnchor: [15, -7],
    innerIconStyle: 'font-size:30px;padding-top:4px;color: #000000'
  };

  var percorsi = L.layerGroup();

  /*for(var i=0; i<elencoSiti.length; i++) {

      var riga = elencoSiti[i];

      var denominazione = riga[1];
      var latitudine = riga[4];
      var longitudine = riga[5];

      L.marker([latitudine, longitudine], {
        icon: L.BeautifyIcon.icon(options),
        draggable: false
      }).bindPopup("<b>" + denominazione +"</b><br /><img src='img/percorsi/eremo/foto2.jpg' width='130px'><br/><div id='trail-rating'><ul class='ratings'><li class='average'><span id='rating' class='rating star3_5'>&nbsp;</span></li></ul></div><br/><div class=\"divTable\"><div class=\"divTableRow\"><div class=\"divTableHead1\">Facile</div><div class=\"divTableHead2\">2,5 Km</div><div class=\"divTableHead3\">2 h</div></div></div><br/><a href='#' onclick=\"fn.load('scheda.html')\">Vai alla scheda</a>").addTo(percorsi);
  }*/
  L.marker([42.511,11.625], {
    icon: L.BeautifyIcon.icon(options),
    draggable: false
  }).bindPopup("<b>Eremo di Poggio Conte</b><br /><img src='img/percorsi/eremo/foto2.jpg' width='130px'><br/><div id='trail-rating'><ul class='ratings'><li class='average'><span id='rating' class='rating star3_5'>&nbsp;</span></li></ul></div><br/><div class=\"divTable\"><div class=\"divTableRow\"><div class=\"divTableHead1\">Facile</div><div class=\"divTableHead2\">2,1 Km</div><div class=\"divTableHead3\">25 m</div></div></div><br/><a href='#' onclick=\"fn.load('scheda.html')\">Vai alla scheda</a>").addTo(percorsi);

  var map = new L.Map('mapid',{
      center: new L.LatLng(42.585280, 11.933396),
      zoom: 9,
      layers: [roads, percorsi]
  });

  var baseLayers = {
      "Standard": roads,
      "Satellite": satellite,
      "Altimetria": terrain,
      "Ibrido": hybrid
  };

  var overlays = {
      "Percorsi": percorsi
  };

  L.control.layers(baseLayers, overlays).addTo(map);
}
