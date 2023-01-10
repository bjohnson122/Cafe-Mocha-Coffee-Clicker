function updateCoffeeView(coffeeQty) {
  let coffeeCount = document.getElementById("coffee_counter");
  return (coffeeCount.innerText = coffeeQty);
}

function clickCoffee(data) {
  data.coffee++;
  const coffeeCount = document.getElementById("coffee_counter");
  coffeeCount.innerText = data.coffee;
  renderProducers(data);
}

function unlockProducers(producers, coffeeCount) {
  producers.forEach((producer) => {
    if (coffeeCount >= producer.price / 2) {
      return (producer.unlocked = true);
    }
  });
}

function getUnlockedProducers(data) {
  let arrayOfProducers = data.producers;

  return arrayOfProducers.filter((producer) => {
    return producer.unlocked === true;
  });
}

function makeDisplayNameFromId(id) {
  return id
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  return parent;
}

function renderProducers(data) {
  const producerContainer = document.querySelector("#producer_container");

  unlockProducers(data.producers, data.coffee);

  deleteAllChildNodes(producerContainer);

  let arrayOfUnlockedProducers = getUnlockedProducers(data);

  return arrayOfUnlockedProducers.forEach((producer) => {
    producerContainer.appendChild(makeProducerDiv(producer));
  });
}

function getProducerById(data, producerId) {
  let arrayOfProducers = data.producers;
  return arrayOfProducers.find((producer) => producer.id === producerId);
}

function canAffordProducer(data, producerId) {
  return data.coffee >= getProducerById(data, producerId).price ? true : false;
}

function updateCPSView(cps) {
  const coffeePerSecond = document.getElementById("cps");
  coffeePerSecond.innerText = cps;
  return coffeePerSecond;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  const producer = getProducerById(data, producerId);
  if (canAffordProducer(data, producerId)) {
    producer.qty++;
    data.coffee -= producer.price;

    producer.price = updatePrice(producer.price);
    data.totalCPS += producer.cps;
    return true;
  }
  return false;
}

function buyButtonClick(event, data) {
  const target = event.target;
  if (target.tagName === "BUTTON") {
    const producer = event.target.id.slice(4);
    if (attemptToBuyProducer(data, producer) === false) {
      window.alert("Not enough coffee!");
    }
    renderProducers(data);
    updateCoffeeView(data.coffee);
    updateCPSView(data.totalCPS);
  }
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  return renderProducers(data); 
}

saveGame = function (data) {
  if (typeof Storage !== "undefined") {
    localStorage.setItem("score", JSON.stringify(data.coffee));
  }
};

loadGame = function () {
  const game = localStorage.getItem("score");
  JSON.parse(game);
};

  
if (typeof process === "undefined") {
  const data = window.data;
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  setInterval(() => tick(data), 1000);
}

else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
