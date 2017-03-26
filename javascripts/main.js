
var milkButton = document.querySelector("#milk");
var breadButton = document.querySelector("#bread");
var gumButton = document.querySelector("#gum");
var registerTotal = document.querySelector("#register-total");
var cashInput = document.querySelector("#cash-input");
var payButton = document.querySelector("#pay");
var resetButton = document.querySelector('#reset');
var currecnySign = document.querySelector('.currecny-sign');
var purchasedTable = document.querySelector('#purchased-table');
var warning = document.querySelector('#warning');
var okMessage = document.querySelector('#okMessage');
var countProducts = document.querySelector('.count-products');

var userLanguage = window.navigator.userLanguage || window.navigator.language;
var supportedCurrencies = [ 'USD', 'EUR', 'NIS'];

function Gum() {
  this.id = 1;
  this.name = 'Bubble gum';
  this.price = 0.5;
}

function Milk() {
  this.id = 2;
  this.name = 'Skim Milk 3%';
  this.price = 5;
  this.discount = 0.5;
}

function Bread() {
  this.id = 3;
  this.name = 'Dark Bread';
  this.price = 10;
  this.discount = 0.15;
}

function Register() {
  var that =this;
  this.products = [];

  this.addProduct = function(product){
    this.products.push(product);

    registerTotal.textContent =
    register.getTotal().toLocaleString(userLanguage, { minimumFractionDigits: 2 });
    countProducts.textContent = '(' + this.products.length + ')';
  };

  this.removeProduct = function (e) {
    var index = 0,
      productsList = that.products,
      productFound = false,
      productToDelete = JSON.parse(e.target.dataset.product);

    for (var product of productsList) {
      if (product.id === productToDelete.id) {
        productFound = true;
        productsList.splice(index, 1);
        break;
      }
      index++;
    }

    if (productFound) {
      registerTotal.textContent =
      register.getTotal().toLocaleString(userLanguage, { minimumFractionDigits: 2 });
      countProducts.textContent = '(' + that.products.length + ')';
      that.renderPurchasedTable();
    }
  };

  this.clearPurchasedTable = function () {
    while (purchasedTable.firstChild) {
      purchasedTable.removeChild(purchasedTable.firstChild);
    }
  };

  this.renderPurchasedTable = function () {
    this.clearPurchasedTable();

    for(var product of this.products) {
      var price = product.price;
      var discounted = 0;
      var purchasedTR = document.createElement('tr');
      var purchasedTD = document.createElement('td');

      var purchasedWrapper = document.createElement('div');
      var purchasedName = document.createElement('span');
      var purchasedText = document.createElement('span');
      var discountedText = document.createElement('span');
      var purchasedButton = document.createElement('button');

      purchasedWrapper.appendChild(purchasedButton);
      purchasedWrapper.appendChild(purchasedName);
      purchasedWrapper.appendChild(purchasedText);
      purchasedTD.appendChild(purchasedWrapper);
      purchasedTR.appendChild(purchasedTD);
      purchasedTable.appendChild(purchasedTR);

      purchasedName.setAttribute('class', 'pull-left text-spaces');
      purchasedName.textContent = product.name;

      if (product.discount) {
        purchasedWrapper.appendChild(discountedText);
        purchasedText.setAttribute('class', 'cash-font discounted');
        purchasedText.textContent = that.getFormattedAmount(price);
        price = product.price * (1 - product.discount);
        discountedText.setAttribute('class', 'cash-font text-spaces');
        discountedText.textContent = that.getFormattedAmount(price);
      } else {
        purchasedText.setAttribute('class', 'cash-font text-spaces');
        purchasedText.textContent = that.getFormattedAmount(price);
      }

      purchasedWrapper.setAttribute('class', 'purchased-button');
      purchasedButton.onclick = that.removeProduct;
      purchasedButton.setAttribute('data-product', JSON.stringify(product));
      purchasedButton.setAttribute('class', 'btn btn-danger pull-left left-button');
      purchasedButton.textContent = '-';

    }
  };

  this.getFormattedAmount = function (value) {
    var currency = supportedCurrencies[0]; // Default

    switch (userLanguage) {
      case 'iw-IL':
        currency = supportedCurrencies[2];
        break;
      case 'de-DE':
      case 'en-GB':
        currency = supportedCurrencies[1];
        break;
    }
    return value.toLocaleString(userLanguage,
      {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
      });
  };

  this.getCurrencySign = function () {
    var dummyValue = that.getFormattedAmount(0);
    return dummyValue.substr(0, 1);
  };

  this.getTotal = function(){
    var result = 0;

    for(var product of this.products) {
      if(product.discount)
        result += product.price * (1-product.discount);
      else
        result += product.price;
    }

    that.renderPurchasedTable();
    return result;
  };

  this.reset = function () {
    this.products = [];
    countProducts.textContent = '(0)';
    registerTotal.innerHTML = this.getTotal();
    cashInput.value = 0;
  };

  this.pay = function(amount){
    if(amount >= this.getTotal()){
      var change = amount - this.getTotal();
      var showGreetingsTimer;
      if (change > 0) {
        okMessage.textContent = 'Here is your change!';
        okMessage.setAttribute('class', 'here-is-your-change');
        showGreetingsTimer = setTimeout(function () {
          okMessage.setAttribute('class', 'hide');
          clearTimeout(showGreetingsTimer);
          that.reset();
        }, 4000);
        console.log("Here's your change " + change);
      } else {
        okMessage.textContent = 'Thank you!';
        okMessage.setAttribute('class', 'here-is-your-change');
        showGreetingsTimer = setTimeout(function () {
          okMessage.setAttribute('class', 'hide');
          clearTimeout(showGreetingsTimer);
          that.reset();
        }, 3000);
      }
    } else {
      warning.setAttribute('class', 'warning');
      throw new Error("Not enough money!");
    }
  };
}

milkButton.addEventListener("click", function(){
  register.addProduct(new Milk());
});

breadButton.addEventListener("click", function(){
  register.addProduct(new Bread());
});

gumButton.addEventListener("click", function(){
  register.addProduct(new Gum());
});

resetButton.addEventListener('click', function () {
  register.reset();
});

var register = new Register();

var currentCurrency = register.getCurrencySign();
currecnySign.textContent = currentCurrency + ' ';
payButton.textContent = ' ' + currentCurrency + ' ';
payButton.addEventListener("click", function(){
  register.pay(cashInput.value);
});