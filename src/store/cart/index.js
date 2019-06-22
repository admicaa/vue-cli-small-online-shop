import Vue from 'vue';
let cart = window.localStorage.getItem('cart');

const state = {
    cart: cart ? JSON.parse(cart) : [],
    cartProducts: []

}
const getters = {
    cart: state => {

        return state.cart;
    },
    cartCount: state => {
        let count = state.cart.length ? state.cart.reduce((item1, item2) => {
            return { quantity: item1.quantity + item2.quantity }
        })['quantity'] : 0;
        return count > 9 ? '+9' : count;
    },
    isProductInCart: (state) => (id) => {
        return Boolean(
            state.cart.filter(product => {
                return product.id === id;
            }).length
        );
    },
    productCountInCard: (state, getters) => (id) => {
        if (!getters.isProductInCart(id)) {
            return false;
        }
        return state.cart.find(product => product.id === id).quantity;
    }
}
const actions = {
    addProductToCart(context, payload) {
        context.commit('onAddProductToCart', payload);
    },
    getCartProducts(context) {
        let ProductsIp = context.state.cart.map(product => product.id);
        let ProductsIpQuery = ProductsIp.join('&id=');
        Vue.axios.get('/products?id=' + ProductsIpQuery).then(response => {
            context.commit('updateCartProducts', response.data);
        });

    }
}

const mutations = {
    saveCart(state) {
        window.localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    onAddProductToCart(state, payload) {
        let ProductFound = state.cart.find(product => product.id == payload.id);
        if (ProductFound) {
            ProductFound.quantity = payload.quantity;
        } else {
            state.cart.push(payload);
        }
        this.commit('saveCart');
    },
    updateCartProducts(state, products) {
        state.cartProducts = products;
    }

}

export default {
    state,
    getters,
    actions,
    mutations
}