
const buttonAdd = document.getElementById("button_addToCart");


buttonAdd.addEventListener('click', function (e) {
    e.preventDefault(); 
    const userCart = buttonAdd.getAttribute('data-user-cart');
    const productId = buttonAdd.getAttribute('data-prod-id');        
    add(userCart, productId);
});



function add(userCart, productId) {
    fetch(`/api/cart/${userCart}/products/${productId}`, {
        method: 'POST',
    }).then(result => {

        if (result.status === 200) {    
            return result.json().then(data => {

                const productAdded = data.payload 
                Swal.fire({
                    toast: true,
                    position: "top-right",
                    text: `${productAdded.title} was added to your cart`,
                    timer: 5000,
                    showConfirmButton: false
                });                    
            });

        } else {
            Swal.fire({
                toast: true,
                position: "top-right",
                text: `You cant add your own product to your cart`,
                timer: 5000,
                showConfirmButton: false
            });
            return result.json().then(errorData => {
                throw new Error(errorData.error);
            });
        }
    })
        .catch(error => { error.message;

            /* Swal.fire({
                toast: true,
                position: "top-right",
                text: "User coudnt be deleted",
                timer: 5000,
                showConfirmButton: false
            }); */

        })
}