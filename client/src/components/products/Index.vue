<template>
  <div class="container">
    <main-header navsel="back"></main-header>
    <div class="product-header">
      <br />
      <br />
      <h2>ส่วนจัดการ Products</h2>
      <div>
        <form class="form-inline form-search">
          <div class="form-group">
            <div class="input-group">
              <input
                type="text"
                v-model="search"
                class="form-control"
                id="exampleInputAmount"
                placeholder="Search"
              />
              <div class="input-group-addon">
                <i class="fas fa-search"></i>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="create-product">
        <button class="btn btn-success btn-sm" v-on:click="navigateTo('/product/create')">Create product</button>
        <strong>จํานวน product:</strong>
        {{results.length}}
      </div>

      <ul class="categories">
        <li v-for="cate in category" v-bind:key="cate.index">
          <a v-on:click.prevent="setCategory(cate)" href="#">{{ cate }}</a>
        </li>
        <li class="clear">
          <a v-on:click.prevent="setCategory(' ')" href="#">Clear</a>
        </li>
      </ul>
      <div class="clearfix"></div>
    </div>
    <transition-group name="fade">
      <div v-for="product in products" v-bind:key="product.id" class="product-list">
        <!-- <p>id: {{ product.id }}</p> -->
        <div class="product-pic">
          <!-- <transition name="fade"> -->
          <div class="thumbnail-pic" v-if="product.thumbnail != 'null'">
            <img :src="BASE_URL+product.thumbnail" alt="thumbnail" />
          </div>
          <!-- </transition> -->
        </div>
        <h3>{{ product.title }}</h3>
        <!--<div v-html="product.content.slice(0,10) + '...'"></div>-->
        <div class="product-info">
          <p>
            <strong>Category:</strong>
            {{ product.category }}
          </p>
          <p>
            <strong>Create:</strong>
            {{ product.createdAt }}
          </p>
          <p>
            <strong>status:</strong>
            {{ product.status }}
          </p>
          <p>
            <strong>Prices:</strong>
            {{ product.prices | getNumberWithCommas }} บาท
          </p>
          <!-- <p>status: {{ product.status }}</p> -->
          <p>
            <button class="btn btn-sm btn-info" v-on:click="navigateTo('/product/'+ product.id)">View Product</button>
            <button
              class="btn btn-sm btn-warning"
              v-on:click="navigateTo('/product/edit/'+ product.id)"
            >Edit product</button>
            <button class="btn btn-sm btn-danger" v-on:click="deleteProduct(product)">Delete</button>
          </p>
          <p>
            <a class="btn btn-danger btn-sm" href="#" v-on:click.prevent="suspend(product.id)">
              <i class="fas fa-pause"></i> Suspend
            </a>&nbsp;
            <a class="btn btn-success btn-sm" href="#" v-on:click.prevent="publish(product.id)">
              <i class="fas fa-check"></i> Published
            </a>&nbsp;
          </p>
        </div>
        <div class="clearfix"></div>
      </div>
    </transition-group>

    <div id="product-list-bottom">
      <div class="empty-product" v-if="products.length === 0 && loading === false">*** ไม่มีข้อมูล***</div>
      <div class="empty-product" v-if="products.length === 0 && loading === true">*** ไม่มีข้อมูล***</div>
      <div
        class="product-load-finished"
        v-if="products.length === results.length && results.length > 0"
      >โหลดข้อมูลครบแล้ว</div>
    </div>
  </div>
</template>
<script>
import ProductsService from "@/services/ProductsService";
import _ from "lodash";
import ScrollMonitor from "scrollMonitor";

let LOAD_NUM = 5;
let pageWatcher;

export default {
  watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: "products",
      };

      if (this.search !== "") {
        route.query = {
          search: this.search,
        };
      }

      console.log("search: " + this.search);
      this.$router.push(route);
    }, 700),

    "$route.query.search": {
      immediate: true,
      async handler(value) {
        this.products = [];
        this.results = [];
        this.loading = true;
        this.results = (await ProductsService.index(value)).data;
        this.appendResults();

        this.results.forEach((product) => {
          if (this.category.length > 0) {
            // console.log(this.category.indexOf(product.category))
            if (this.category.indexOf(product.category) === -1) {
              this.category.push(product.category);
            }
          } else {
            this.category.push(product.category);
          }
        });
        this.loading = false;
        this.search = value;
        //console.log(this.category)
      },
    },
  },
  data() {
    return {
      products: [],
      BASE_URL: "http://localhost:8081/assets/uploads/",
      search: "",
      results: [],
      category: [],
      loading: false,
    };
  },
  async created() {
    this.products = (await ProductsService.index()).data;
  },
  methods: {
    wait(ms) {
      return (x) => {
        return new Promise((resolve) => setTimeout(() => resolve(x), ms));
      };
    },
    appendResults: function () {
      if (this.products.length < this.results.length) {
        let toAppend = this.results.slice(
          this.products.length,
          LOAD_NUM + this.products.length // จำกัดการแสดงผล
        );
        this.products = this.products.concat(toAppend);
      }
    },
    navigateTo(route) {
      this.$router.push(route);
    },
    async deleteProduct(product) {
      try {
        await ProductsService.delete(product);
        this.refreshData();
      } catch (err) {
        console.log(err);
      }
    },
    async refreshData() {
      this.products = (await ProductsService.index()).data;
    },
    setCategory(keyword) {
      if (keyword === " ") {
        this.search = "";
        console.log("null");
      } else {
        this.search = keyword;
      }
    },
    updated() {
      let sens = document.querySelector("#product-list-bottom");
      pageWatcher = ScrollMonitor.create(sens);
      pageWatcher.enterViewport(this.appendResults);
    },
    beforeUpdated() {
      if (pageWatcher) {
        pageWatcher.destroy();
        pageWatcher = null;
      }
    },
    async suspend(productId) {
      let user = {
        id: productId,
        status: " Suspend",
      };
      try {
        await ProductsService.put(user);
        this.refreshData();
      } catch (error) {
        console.log(error);
      }
    },
    async publish(productId) {
      let user = {
        id: productId,
        status: "published",
      };
      try {
        await ProductsService.put(user);
        this.refreshData();
      } catch (error) {
        console.log(error);
      }
    },
  },
  filters: {
    getNumberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>
<style scoped>
.empty-product {
  width: 100%;
  text-align: center;
  padding: 4px;
  background: coral;
  color: white;
}
/* thumbnail */
.thumbnail-pic img {
  width: 200px;
  padding: 5px 10px 0px 0px;
}
.product-info {
  float: left;
}
.product-pic {
  float: left;
}
.clearfix {
  clear: both;
}
.product-list {
  border: solid 1px #dfdfdf;
  margin-bottom: 10px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding: 5px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.product-header {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

#product-list-bottom {
  padding-top: 4px;
}

#product-list-bottom {
  padding: 4px;
  text-align: center;
  color: white;
}
.categories {
  margin-top: 10px;
  padding: 0;
  list-style: none;
  float: left;
}
.categories li {
  float: left;
  padding: 2px;
}
.categories li a {
  padding: 5px 10px 5px 10px;
  background: paleturquoise;
  color: black;
  text-decoration: none;
}
.create-product {
  margin-top: 10px;
}
.categories li.clear a {
  background: tomato;
  color: white;
}
.product-load-finished {
  padding: 4px;
  text-align: center;
  background: seagreen;
  color: white;
}
.emptyproduct {
  background-color: coral;
  border-color: coral;
}
</style>