/* Una vez añadida la instancia de Vuejs en index.html, compruebo que ésta se importó correctamente */
//console.log(Vue);

var PRICE = 9.99;
var LOAD_NUM = 10;

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        results: [],
        newSearch: 'Gato',
        lastSearch: '',
        loading: false,
        price: PRICE
    },
    computed: {
        noMoreItems: function () {
            return this.items.length === this.results.length && this.results.length > 0;
        }
    },
    methods: {
        appendItems: function() {
            //console.log('appendItems');
            if(this.items.length < this.results.length) {
                var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append);
            }
        },
        onSubmit: function() {
            // Require a search String.
            if(this.newSearch.length) {
                this.items = [];
                this.loading = true;
                this.$http
                    .get('/search/'.concat(this.newSearch))
                    .then(function(res) {
                        //console.log(res.data);
                        this.lastSearch = this.newSearch;
                        this.results = res.data;
                        this.appendItems();
                        this.loading = false;
                    })
                ;
            }
        },
        addItem: function(index) {
            //console.log('addItem');
            //console.log(index);
            this.total += PRICE;
            var item = this.items[index];
            var found = false;

            for(var i = 0; i < this.cart.length; i++) {
                if(this.cart[i].id === item.id) {
                    found = true;
                    this.cart[i].qty++;
                    break;
                }
            }

            if(!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    qty: 1,
                    price: PRICE
                });
            }
            //console.log(this.cart.length);
        },
        inc: function(item) {
            //console.log('inc');
            item.qty++;
            this.total += item.price;
        },
        dec: function(item) {
            //console.log('dec');
            item.qty--;
            this.total -= item.price;
            // Cuando la cantidad es 0 el item lo borramos de la cesta.
            if(item.qty <= 0) {
                for(var i = 0; i < this.cart.length; i++) {
                    if(this.cart[i].id === item.id) {
                        this.cart.splice(i, 1);
                        break;
                    }
                }
            }
        }
    },
    filters: {
        currency: function(price) {
            return price.toFixed(2) + ' €';
        }
    },
    mounted: function() {
        this.onSubmit();

        //console.log(scrollMonitor);
        var vueInstance = this;
        var elem = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(elem);
        watcher.enterViewport( function() {
            //console.log('Entered viewport');
            vueInstance.appendItems();
        });
    }
});

