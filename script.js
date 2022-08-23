// Hello, the code passes all test specs but I have a quick question regarding return statements (noted on lines 110-111 & 148 - 149)

/**************
 *   SLICE 1
 **************/
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

/**************
 *   SLICE 2
 **************/

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

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
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

/**************
 *   SLICE 3
 **************/

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
  /* 
  this function and the updateCoffeeView function works with and without a return statement. Why is that?
  From my research the return statement is 'optional' depending on how the code is written/logic. 
  In your opinion, is one better practice than the other (or is it based on what we think is best for our specific function)?
  */
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
  return renderProducers(data); //is the return statement necessary here too?
  //It passed the test specs without it
}

/*************************
 * EXTRA CREDIT ATTEMPTS BELOW! *also see style.CSS
 *************************/

saveGame = function (data) {
  if (typeof Storage !== "undefined") {
    localStorage.setItem("score", JSON.stringify(data.coffee));
  }
};

loadGame = function () {
  const game = localStorage.getItem("score");
  JSON.parse(game);
};

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", (event) => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
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
