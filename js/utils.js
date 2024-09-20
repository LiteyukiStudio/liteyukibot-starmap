let chart = echarts.init(document.getElementById('echartsMap'));
let box = document.getElementById('myBox');
function setAllRegionsUnselectable(geoModel) {
    let regions = geoModel.get('regions');
    for (let i = 0; i < regions.length; i++) {
        let region = regions[i];
        region.selected = false;
    }
    geoModel.set('regions', regions);
    chart.setOption({
        geo: {
            regions: regions
        }
    });
}
function updateSizes(symbolSizeMin = symbolSizeRange[0], symbolSizeMax = symbolSizeRange[1]) {
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;

    let fontSize = Math.max(20, Math.min(24, windowHeight / 100));

    let symbolSize = Math.max(symbolSizeMin, Math.min(symbolSizeMax, windowWidth / 150));

    chart.setOption({
        title: {
            textStyle: {
                fontSize: fontSize
            }
        },
        series: [{
            symbolSize: symbolSize
        }]
    });
}
window.addEventListener("resize", function () {
    chart.resize();
    updateSizes();
});
let options = {
    backgroundColor: '#454545',
    title: {
        text: 'LiteyukiBot Distribution',
        subtext: 'LiteyukiBot Distribution',
        textStyle: {
            color: '#fff',
            fontSize: 20
        },
        top: '20px',
        left: '20px'
    },
    geo: {
        map: 'world',
        roam: false,
        itemStyle: {
            normal: {
                areaColor: '#111',
                borderColor: '#303030'
            },
            emphasis: {
                areaColor: '#111',
                borderColor: '#303030'
            }
        },
        regions: []
    },
    series: [],
    textStyle: {
        fontSize: 0
    }
}
chart.setOption(options);

fetch('https://api.liteyuki.icu/distribution')
    .then(response => response.json())
    .then(data => {
        const locations = data.locations;
        const seriesData = locations.map(location => ({
            value: [location[1], location[0]]
        }));

        chart.setOption({
            series: [{
                type: 'scatter',
                coordinateSystem: 'geo',
                itemStyle: {
                    color: '#a2d8f4'
                },
                symbol: 'circle',

                data: seriesData
            }]
        });

        chart.on('ready', function () {
            let geoModel = chart.getModel().componentModels.geo[0];
            setAllRegionsUnselectable(geoModel);
        });
        box.style.visibility = "visible";
        updateSizes();
    })
    .catch(error => console.error('Error fetching data:', error));

const radioButtons = box.querySelector('.radio-buttons');
const box_label = box.querySelector('.box-label');
const radioInputs = radioButtons.querySelectorAll('input[type="radio"]');

radioInputs.forEach(radioInput => {
    radioInput.addEventListener('change', function (event) {
        const selectedValue = event.target.value;
        //console.log('Selected value:', selectedValue);
        let option = chart.getOption();
        option.series[0].symbol = symbols_const[selectedValue]['symbol']
        chart.setOption(option);
        symbolSizeRange = [symbols_const[selectedValue]['symbolSize']['min'], symbols_const[selectedValue]['symbolSize']['max']];
        updateSizes();
    });
});
box.addEventListener('click', function () {
    this.classList.add('box-expanded');
    radioButtons.style.visibility = 'visible';
    box_label.style.visibility = 'visible';

});

box.addEventListener('mouseout', function (event) {
    if (event.relatedTarget === null || !this.contains(event.relatedTarget)) {
        this.classList.remove('box-expanded');
        radioButtons.style.visibility = 'hidden';
        box_label.style.visibility = 'hidden';
    }
});
