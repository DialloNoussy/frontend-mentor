const DATA_URL = 'https://raw.githubusercontent.com/BarreraJorgeL/expenses-chart-component/master/data.json';
const GRAPHIC_BARS_CONTAINER = document.querySelector('.balance--week__graphic');
const GRAPHIC_TITLE_CONTAINER = document.querySelector('.balance--week__title')

function getData(){
  return fetch(DATA_URL).then(response => response.json());
}

function barDesign (dj) {
  return `<li class="day">
  <div class="day__bar" value="${dj.amount}"></div>
  <p class="day__name">${dj.day}</p>
  </li>`
}

function setBars(DATA_JSON){
  DATA_JSON.slice().reverse().forEach( dj => {
    GRAPHIC_BARS_CONTAINER.insertAdjacentHTML('afterbegin', barDesign(dj));
  });
}

function createGraphic(GRAPHIC_TITLE, DATA_JSON){
  GRAPHIC_TITLE_CONTAINER.innerText = GRAPHIC_TITLE;
  setBars(DATA_JSON);
}

function getBarContainers(){
  let barContainers = Array.from(document.querySelectorAll('.day'));
  return barContainers;
}

function getBars(){
  let bars = Array.from(document.querySelectorAll('.day__bar'));
  return bars;
}

function setHeightBars(){
  const BARS = getBars();
  BARS.forEach(e => {
    e.style.height = (e.attributes.value.value) * 1.8 + 'px';
  });
}

function compareNumbers(a, b){
  return a - b;
}

function getMostHighAmount(DATA_JSON){
  let amounts = [];
  let mostHighAmount;
  DATA_JSON.forEach(dj => {
    amounts.push(dj.amount);
  });
  mostHighAmount = amounts.sort(compareNumbers)[amounts.length - 1];
  return mostHighAmount;
}

function resaltMostTallBar(DATA_JSON){
  const BARS = getBars();
  const MOST_HIGH_AMOUNT = getMostHighAmount(DATA_JSON);

  BARS.forEach(br => {
    if(br.attributes.value.value == MOST_HIGH_AMOUNT){
      br.classList.add('dangerous-day');
    }
  });
}

function showFloatingAmount(TARGET, BOOLEAN){
  try{
    if(BOOLEAN){
      let amount =  TARGET.firstElementChild.attributes.value.value;
      let description = `<p class="day__bar--amount">$${amount}</p>`;
      TARGET.insertAdjacentHTML('beforeend', description);
    }
    else{
      const description = document.querySelector('.day__bar--amount');
      description.remove();
    }
  }
  catch(err){
    return
  }
}

async function printData(){

  try{
    const DATA_JSON = await getData();
    const GRAPHIC_TITLE = `Spending - Last ${DATA_JSON.length} days`;

    createGraphic(GRAPHIC_TITLE, DATA_JSON);
    setHeightBars();
    resaltMostTallBar(DATA_JSON);

    const BAR_CONTAINERS = getBarContainers();
    BAR_CONTAINERS.forEach(bc => {
      bc.addEventListener('mouseenter', () => {
        showFloatingAmount(bc, true);
      });
      bc.addEventListener('mouseleave', () => {
        showFloatingAmount(bc, false);
      });
    });
  }
  catch(err){
    console.log('no hay datos');
  }
}

printData();