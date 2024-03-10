
// timer


let datetoday = document.getElementById('date');
let days = document.getElementById("days");
let hourss = document.getElementById("hours");
let minutess = document.getElementById("minutes");
let secondss = document.getElementById("seconds");

// Get todays date and time
setInterval(() => {
    let date = new Date();
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    if (day <100) {
        days.innerHTML = day
        hourss.innerHTML = hours
        minutess.innerHTML = minutes
        secondss.innerHTML = seconds
    }
    else {
        datetoday.innerHTML = "O F F E R  C L  O S E D"
        datetoday.classList.add("red")
    }
}, 1000);


// EMAIL JS

let btn = document.getElementById("btn");
btn.addEventListener("click",()=>{
    emailjs.send("service_yh0f1q3", "template_7334svj", {
        fullName: document.getElementById("fullName").value,
        emailAddress: document.getElementById("emailAddress").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        message: document.getElementById("message").value,
    }).then(()=>{
        alert("your message sent successfully. we will contact you shortly.")
      })
})


// API

let select = document.querySelectorAll('.currency')
let btnCC = document.getElementById('btnCC')
let input = document.getElementById('input')
fetch('https://api.frankfurter.app/currencies')
.then(res=>res.json())
.then(res=>displayDropDown(res))

function displayDropDown(res){
  //console.log(Object.entries(res)[2][0])
  let curr = Object.entries(res)
  for(let i=0;i<curr.length;i++){
    let opt = `<option value="${curr[i][0]}">${curr[i][0]}</option>`
    select[0].innerHTML += opt
    select[1].innerHTML += opt
  }
}

btnCC.addEventListener('click',()=>{
  let curr1 = select[0].value
  let curr2 = select[1].value
  let inputVal = input.value
  if(curr1===curr2)
    alert("Choose different currencies")
  else
    convert(curr1,curr2,inputVal)
});

function convert(curr1,curr2,inputVal){
  const host = 'api.frankfurter.app';
  fetch(`https://${host}/latest?amount=${inputVal}&from=${curr1}&to=${curr2}`)
  .then(resp => resp.json())
  .then((data) => {
    document.getElementById('result').value = Object.values(data.rates)[0]
  });

}


// cart

let products = null;

// get data from file json



fetch('productsItems.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();
})

//show datas product in list 


function addDataToHTML(){


  // remove datas default from HTML


  let listProductHTML = document.querySelector('.listProduct');
  listProductHTML.innerHTML = '';

  // add new datas

  if(products != null) // if has data.

  {
      products.forEach(product => {
          let newProduct = document.createElement('div');
          newProduct.classList.add('item');
          newProduct.innerHTML = 
          `<img src="${product.image}" alt="">
          <h2>${product.name}</h2>
          <div class= "priceAndButton">
          <div class="price">$${product.price}</div>
          <button class="btn btn-outline-dark" onclick="addCart(${product.id})">Add To Cart</button>
          </div>`;

          listProductHTML.appendChild(newProduct);

      });


  }
}


//use cookie so the cart doesn't get lost on refresh page




let listCart = [];
function checkCart(){
    var cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('listCart='));


    if(cookieValue){
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }else{
        listCart = [];
    }


}



checkCart();


function addCart($idProduct){


    let productsCopy = JSON.parse(JSON.stringify(products));

    
    //// If this product is not in the cart

    if(!listCart[$idProduct]) 
    {
        listCart[$idProduct] = productsCopy.filter(product => product.id == $idProduct)[0];
        listCart[$idProduct].quantity = 1;
    }else{

        //If this product is already in the cart.
        //I just increased the quantity


        listCart[$idProduct].quantity++;
    }
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";

    addCartToHTML();
}


addCartToHTML();
function addCartToHTML(){

    // clear data default

    let listCartHTML = document.querySelector('.listCart');
    listCartHTML.innerHTML = '';

    let totalHTML = document.querySelector('.totalQuantity');
    let totalQuantity = 0;

    // if has product in Cart

    if(listCart){
        listCart.forEach(product => {
            if(product){
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML = 
                    `<img src="${product.image}">
                    <div class="content">
                        <div class="name">${product.name}</div>
                        <div class="price">$${product.price}</div>
                    </div>
                    <div class="quantity">
                        <button class="btn btn-outline-dark border-0" onclick="changeQuantity(${product.id}, '-')">-</button>
                        <span class="value">${product.quantity}</span>
                        <button class="btn btn-outline-dark border-0" onclick="changeQuantity(${product.id}, '+')">+</button>
                    </div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity = totalQuantity + product.quantity;
            }
        })
    }
    totalHTML.innerText = totalQuantity;
}



function changeQuantity($idProduct, $type){

    switch ($type) {
        case '+':
            listCart[$idProduct].quantity++;
            break;
        case '-':
            listCart[$idProduct].quantity--;

            // if quantity <= 0 then remove product in cart
            if(listCart[$idProduct].quantity <= 0){
                delete listCart[$idProduct];
            }
            break;
    
        default:
            break;

    }


    // save new data in cookie

    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";

    // reload html view cart
    
    addCartToHTML();
}