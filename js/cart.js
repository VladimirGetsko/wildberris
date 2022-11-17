const cart = () => {
    const cartBtn = document.querySelector('.button-cart');
    const cart = document.getElementById('modal-cart');
    const closeBtn = cart.querySelector('.modal-close');
    const goodsContsiner = document.querySelector('.long-goods-list');
    const cartTable = document.querySelector('.cart-table__goods');
    const modalForm = document.querySelector('.modal-form');

    const deletCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const newCart = cart.filter(good => {
            return good.id !== id;
        }) 

        localStorage.setItem('cart', JSON.stringify(newCart));

        renderCartGods(JSON.parse(localStorage.getItem('cart')));
    }

    const pluseCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const newCart = cart.map(good => {
            if(good.id === id) {
                good.count += 1;
            }

            return good;
        })

        localStorage.setItem('cart', JSON.stringify(newCart));

        renderCartGods(JSON.parse(localStorage.getItem('cart')));
    }

    const minusCartItem = (id) => {
        const cart = JSON.parse(localStorage.getItem('cart'));

        const newCart = cart.map(good => {
            if(good.id === id) {
                if(good.count > 0) {
                    good.count -= 1;
                }
            }

            return good;
        })

        localStorage.setItem('cart', JSON.stringify(newCart));

        renderCartGods(JSON.parse(localStorage.getItem('cart')));
    }

    const addToCart = (id) => {
        const goods = JSON.parse(localStorage.getItem('goods'));
        const clickedGood = goods.find(good => good.id === id);
        const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

        if(cart.some(good => good.id === clickedGood.id)) {
            cart.map(good => {
                if(good.id === clickedGood.id) {
                    good.count += 1;
                }

                return good;
            })
        } else {
            clickedGood.count = 1;
            cart.push(clickedGood);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    }

    const renderCartGods = (goods) => {
        cartTable.innerHTML = '';

        goods.forEach(good => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${good.name}</td>
                <td>${good.price}$</td>
                <td><button class="cart-btn-minus">-</button></td>
                <td>${good.count}</td>
                <td><button class="cart-btn-plus">+</button></td>
                <td>${+good.price * +good.count}$</td>
                <td><button class="cart-btn-delete">x</button></td>
            `

            cartTable.append(tr);

            tr.addEventListener('click', (e) => {
                
                if(e.target.classList.contains('cart-btn-minus')) {
                    minusCartItem(good.id);
                } else if (e.target.classList.contains('cart-btn-plus')) {
                    pluseCartItem(good.id);
                } else if (e.target.classList.contains('cart-btn-delete')) {
                    deletCartItem(good.id);
                }
            })
        })
    }

    const sendForm = () => {
        const cartArray = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify({
                cart: cartArray,
                name: '',
                phone: ''
            })
        }).then(() => {
            cart.style.display = '';
        })
    }

    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendForm();
    })

    cartBtn.addEventListener('click', () => {
        const cartArray = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];

        renderCartGods(cartArray);

        cart.style.display = 'flex';
    })

    closeBtn.addEventListener('click', () => {
        cart.style.display = '';
    })

    cart.addEventListener('click', (e) => {
        if (!e.target.closest('modal') && e.target.classList.contains('overlay')) {
            cart.style.display = ''
        }
    })

    window.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') {
            cart.style.display = '';
        }
    })

    if(goodsContsiner) {
        goodsContsiner.addEventListener('click', (e) => {
            if(e.target.closest('.add-to-cart')) {
                const buttonToCart = e.target.closest('.add-to-cart');
                const goodId = buttonToCart.dataset.id;

                addToCart(goodId);
            }
        })
    }
}

cart();