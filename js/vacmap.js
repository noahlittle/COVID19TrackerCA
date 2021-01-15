var map;
var popup;

function drawMap(data) {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwc3RlcnRlY2giLCJhIjoiY2s4M2U4eGJmMWJlejNsb3EyOXV4Zm1zaiJ9.aLWnB4UTvCto0wF5_9fePg';
    map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/empty-v8', // stylesheet location
        bounds: [
            [-142.43651641653042, 39.03798923031434],
            [-48.30904150845262, 68.77550837439571]
        ]
    });
    popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    })

    map.on('load', () => {
        drawProvinces(data);
    })
}

function drawProvinces(data) {
     fetch('./assets/data/provinces.json').then(resp => resp.json()).then(response => {

        var centroidGeoJSON = {
            type: "FeatureCollection",
            features: []
        };
        var fillRange = [];

        response.features.forEach((feature) => {
            feature.id = feature.properties.cartodb_id;
            var provinceData = data.filter(item => item.province === feature.properties.abbreviation)[0];
            feature.properties.province_vaccinations_total = provinceData.total_vaccinations;
           // feature.properties.province_cases_per_population = provinceData.total_cases / (feature.properties.population / 100000);
            feature.properties.province_vaccinations_per_population = ( Math.floor(((provinceData.total_vaccinations) / (feature.properties.population / 100000)) * 10) / 10 );
           // feature.properties.province_cases_active = provinceData.total_cases - provinceData.total_fatalities - provinceData.total_recoveries;
           // feature.properties.province_deaths_total = provinceData.total_fatalities;
           // feature.properties.province_hospitalizations_total = provinceData.total_hospitalizations;
            // feature.properties.province_recoveries_total = provinceData.total_recoveries;
            // feature.properties.province_tests_total = provinceData.total_tests;

            // Making centroids
            var centroidFeature = JSON.parse(JSON.stringify(feature));
            centroidFeature.geometry.coordinates = feature.properties.label_coords;
            centroidFeature.geometry.type = "Point";
            centroidGeoJSON.features.push(centroidFeature);

            if (fillRange.length === 0 || fillRange[0] > feature.properties.province_vaccinations_per_population) {
                fillRange[0] = parseFloat(feature.properties.province_vaccinations_per_population);
            }
            if (fillRange.length === 1 || fillRange[1] < feature.properties.province_vaccinations_per_population) {
                fillRange[1] = parseFloat(feature.properties.province_vaccinations_per_population);
            }
        })

        map.addSource('provinces', {
            type: 'geojson',
            data: response
        });
        map.addSource('provinces-centroids', {
            type: 'geojson',
            data: centroidGeoJSON
        });

        var fillColor = [
            'interpolate',
            ['linear'],
            ["number", ['get', 'province_vaccinations_per_population']],
            fillRange[0], '#F1FFEE',
            fillRange[1] * 0.2, '#68991c',
            fillRange[1] * 0.4, '#456613',
            fillRange[1] * 0.6, '#233309', 
            fillRange[1] * 0.8, '#111905'
        ];

        var mapHTML = `
          <strong>Doses Administered</strong>
          <p>per 100,000 popoulation</p>
          <div class="vac-swatch"></div>
          <ul>
            <li style="text-align:left;">${fillRange[0].toFixed(1)}</li>
            <li style="text-align:center;">${(fillRange[1]*0.5).toFixed(1)}</li>
            <li style="text-align: right;">${fillRange[1].toFixed(1)}</li>
          </ul>
          <p>Total vaccinations to date in red.</p>
        `;

        $('#map-overlay').html(mapHTML);

        map.addLayer({
            id: 'provinces-fill',
            type: 'fill',
            source: 'provinces',
            paint: {
                'fill-color': fillColor,
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.5,
                    0.3
                ]
            }
        }, map.getSource('covid-cases') ? 'covid-cases' : null)

        map.addLayer({
            id: 'provinces-cases',
            type: 'symbol',
            source: 'provinces-centroids',
            layout: {
                'text-field': ["get", "province_vaccinations_total"],
                'text-size': 14,
                'text-offset': [0, 0.6],
            },
            paint: {
                'text-color': '#b22525',
                'text-halo-color': '#FFF',
                'text-halo-width': 2
            }
        })

        map.addLayer({
            id: 'provinces-label',
            type: 'symbol',
            source: 'provinces-centroids',
            layout: {
                'text-field': ["get", "abbreviation"],
                'text-size': 15,
                'text-offset': [0, -0.6],
                'text-ignore-placement': true
            },
            paint: {
                'text-color': '#333',
                'text-halo-color': '#FFF',
                'text-halo-width': 2
            }
        })

        map.addLayer({
            id: 'provinces-line',
            type: 'line',
            source: 'provinces',
            paint: {
                'line-color': '#000',
                'line-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.5,
                    0.3
                ]
            }
        })

        var hoveredStateId = false;
        map.on('mousemove', 'provinces-fill', (e) => {
            if (e.features.length > 0) {
                if (hoveredStateId) {
                    map.setFeatureState({
                        source: 'provinces',
                        id: hoveredStateId
                    }, {
                        hover: false
                    });
                }
                hoveredStateId = e.features[0].id;
                map.setFeatureState({
                    source: 'provinces',
                    id: hoveredStateId
                }, {
                    hover: true
                });
            }

            var properties = e.features[0].properties;
            popup.setLngLat([e.lngLat.lng, e.lngLat.lat]).setHTML(`
              <center><strong>${properties.name}</strong><br />
              Doses Administered: ${properties.province_vaccinations_total} <br />
              Doses Administered per 100,000: ${properties.province_vaccinations_per_population} <br />
              </center>
            `).addTo(map);
        });

        map.on('mouseleave', 'provinces-fill', function() {
            if (hoveredStateId) {
                map.setFeatureState({
                    source: 'provinces',
                    id: hoveredStateId
                }, {
                    hover: false
                });
            }
            popup.remove();
            hoveredStateId = null;
        });
    })
}
