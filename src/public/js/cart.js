let products = [];
/* let totalPurchase; */

const cartTitle = document.getElementById("cart-title");
const cid = cartTitle.getAttribute('data-user-cart');

document.addEventListener('DOMContentLoaded', getProductList);

function getProductList() {
    fetch(`/api/cart/${cid}`, {
        method: 'GET',
    }).then(result => {
        if (result.status === 200) {
            return result.json().then(data => {
                console.log("entra al fetch");
                console.log("cid en el fetch =>", cid)
                products = data.payload;
                showProductList(products);
            });
        } else {
            return result.json().then(errorData => {
                throw new Error(errorData.error);
            });
        }
    }).catch(error => error.message,
            );
    
}

function showProductList(products) {
    const productsDiv = document.getElementById("products-container");
    productsDiv.innerHTML = ''; // Limpiar el contenido previo

    sumTotalCart()

    products.forEach((product) => {
        const stock = product.product.stock
        let subtotal = product.product.price * product.quantity

        let less = product.quantity -1 
        let more = product.quantity + 1

        const productInfo = document.createElement("div");
        productInfo.innerHTML = `
            <br>
            <div class="row-div">
                <p>${product.product.title}</p>            
                <p>Price: $${product.product.price}</p>

                <div class="quantity-div">
                    <p class="quantity-title">Quantity:</p> 
                    <button class="substractQuantity" onclick="updateQuantity('${product.product._id}', '${less}')">-</button>
                    <button class="quantity-button">${product.quantity}</button>            
                    <button class="addQuantity" onclick="updateQuantity('${product.product._id}', '${more}')">+</button>
                </div>

                <p>Subtotal: $${subtotal}</p>
                
                <div class="delete-div">
                    <button class="delete-button" onclick="deleteP('${cid}','${product.product._id}')">Delete</button>
                </div>
            </div>
            <br>
            <br>
        `;
        productsDiv.appendChild(productInfo);


        const substractQuantityButton = productInfo.querySelector('.substractQuantity');

        if (product.quantity <= 1) {
            substractQuantityButton.disabled = true;
        } else {
            substractQuantityButton.disabled = false;
        }

        const addQuantityButton = productInfo.querySelector('.addQuantity');

        if (product.quantity >= stock) {
            addQuantityButton.disabled = true;
        } else {
            addQuantityButton.disabled = false;
        }
    });

    /* sumTotalCart() */
}


function sumTotalCart() {
    const totalDiv = document.getElementById("total-container");    
    totalDiv.innerHTML = ''
    let totalPurchase = products.reduce((accum, producto) => {
      return accum + producto.product.price * producto.quantity;
    }, 0);

    const cartTotal = document.createElement("div");
    cartTotal.innerHTML = `                                   
              <p>Total: $${totalPurchase}</p>`;
    totalDiv.append(cartTotal);
  }



  

  function updateQuantity(pid, productQuantityModified) {

    const Data = {
        quantity: productQuantityModified
    }

    fetch(`/api/cart/${cid}/products/${pid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            cart = data.payload;
            getProductList()            
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}




  function deleteP(cid, pid) {
    fetch(`/api/cart/${cid}/products/${pid}`, {
        method: 'DELETE',
    }).then(result => {

        if (result.status === 200) {

            return result.json().then(data => {

                const deletedProduct = data.payload
                
                let newProductList = products.filter(product => deletedProduct !== product.product._id)
                /* showProductList(newProductList) */ //este no porque yo necesito hacer el fetch al get para que se actualicen los usuarios
                getProductList()

                Swal.fire({
                    toast: true,
                    position: "top-right",
                    text: `Product deleted`,
                    timer: 5000,
                    showConfirmButton: false
                });
                
            });

        } else {
            return result.json().then(errorData => {
                throw new Error(errorData.error);
            });
        }
    })
        .catch(error => { error.message;

            Swal.fire({
                toast: true,
                position: "top-right",
                text: "User coudnt be deleted",
                timer: 5000,
                showConfirmButton: false
            });

        })
}


const buyButton = document.getElementById("buy-cart-button");

buyButton.addEventListener('click', function (e) {
    e.preventDefault();    
    purchase(cid);
});



function purchase(cid) {
    fetch(`/api/cart/${cid}/purchase`, {
        method: 'GET',
    }).then(result => {

        if (result.status === 200) {

            return result.json().then(data => {

                const response = data.payload
                
                if (!response.ticket){
                    Swal.fire({
                        toast: true,
                        position: "top-right",
                        text: `All products are out of stock`,
                        timer: 5000,
                        showConfirmButton: false
                    });
                } else {
                    window.location.href = "/successfulPurchase";
                }               
            });

        } else {
            return result.json().then(errorData => {
                throw new Error(errorData.error);
            });
        }
    })
        .catch(error => { error.message;

            Swal.fire({
                toast: true,
                position: "top-right",
                text: "Purchase couldt be completed",
                timer: 5000,
                showConfirmButton: false
            });

        })
}