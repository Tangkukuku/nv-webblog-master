<template>
    <div class="component-wrapper container">
        <main-header navsel="back"></main-header>
        <br><br>
        <div v-if="product" >
            <div class="product-wrapper" v-if="product != null">
                <h1>{{ product.title }}</h1>
                <p><strong>Category: </strong> 
                <a href="#" v-on:click.prevent="navigateTo(`/products?search=${product.category}`)">{{product.category }}</a></p>
                <p>
          <strong>status:</strong> {{product.status}}
        </p>
                <div class="content" v-html="product.content"></div>
                <!-- <p>category: {{ product.category }}</p>
                <p>status: {{ product.status }}</p> -->
            </div>
            <div class="back-nav"><button class="btn btn-success" v-on:click="navigateTo('/products')"><i class="fas fa-arrow-left"></i> Back..</button></div>
            <comment-comp v-bind:productid="product.id" v-bind:user="user"></comment-comp>
            <transition name="fade">
                <div v-if="resultUpdated != ''" class="popup-msg">
                    <p>{{ resultUpdated }}</p>
                </div>
            </transition>
            <br>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import ProductsService from '@/services/ProductsService'
    import UsersService from '@/services/UsersService'
    import CommentComp from '@/components/Fronts/Comment'

    export default {
        data () {
            return {
                product: null,
                resultUpdated: '',
                users:null,
            }
        },
        components : {
            CommentComp
        },
        async created () {
            // get product
            // check permission first
            try {
                let productId = this.$route.params.productId
                this.product = (await ProductsService.show(productId)).data
            } catch (error) {
                console.log (error)
            }
            },
            methods: {
                navigateTo (route) {
                this.$router.push(route)
                }
            },
            computed: {
                ...mapState([
                    'isUserLoggedIn',
                    'user'
                ])
            }
    }
</script>
<style scoped>
    .hero {
        margin-top: 80px;
        border-radius: 5px;
        background: darkcyan;
        height:250px;
        color:white;
        padding: 20px;
    }
    .hero h1 {
        margin-top: 30px;
    }
    .product-wrapper {
        margin-top:20px;
        padding: 40px;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
    }
    .back-nav {
        margin-top: 20px;
        text-align: center;
    }
    .product-wrapper h1{
        text-align: center;
        font-family: 'kanit';
        padding-bottom: 50px;
    }
    .product-wrapper p {
        font-family: 'kanit';
        font-size: 1.4em;
        padding-bottom:20px;
    }
    .product-wrapper .content {
        font-family: 'kanit';
        font-size: 1.2em;
    }
</style>