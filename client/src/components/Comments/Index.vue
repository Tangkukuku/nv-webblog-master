<template>
    <div class="container">
        <main-header navsel="back"></main-header>
        <div class="product-header">
            <br><br><br>
            <h2>ส่วนจัดการ Comments</h2>
            
            <div>
                <form class="form-inline form-search">
                <div class="form-group">
                    <div class="input-group">
                        <input type="text" v-model="search" class="form-control" id="exampleInputAmount" placeholder="Search">
                        <div class="input-group-addon"><i class="fas fa-search"></i></div>
                    </div>
                </div>
                </form>
            </div>
            <div class="create-product">
                <h4>จํานวน comment {{comments.length}}</h4>
            </div>
        </div>
        <div v-for="comment in comments" v-bind:key="comment.id" class="product-list">
            <strong>comment:</strong>
            <p>id: {{ comment.id }}</p>
            <p>product id: {{ comment.productId }}</p>
            <p>comment: {{ comment.comment }}</p>
            <p>
                <button class="btn btn-sm btn-info" v-on:click="navigateTo('/product/'+ comment.productId)">ดูบล็อกที่ Comment</button> 
                <button class="btn btn-sm btn-danger" v-on:click="deleteComment(comment)">ลบข้อมูล</button>
            </p>
        </div>
        <div id="product-list-bottom">
            <div class="empty-product" v-if="comments.length === 0 && loading === false">*** ไม่มีข้อมูล***</div>
            <div class="empty-product" v-if="comments.length === 0 && loading === true">*** ไม่มีข้อมูล***</div>
            <div class="product-load-finished" v-if="comments.length === results.length && results.length > 0" >โหลดข้อมูลครบแล้ว</div>
        </div>
    </div>
</template>
<script>
import CommentsService from '@/services/CommentsService'
import _ from "lodash";
export default {
   watch: {
    search: _.debounce(async function (value) {
      const route = {
        name: "comments",
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
        this.loading = true;
        this.comments = (await CommentsService.index(value)).data;
        this.results = this.comments
      },
    },
  },
    data () {
        return {
            comments: [],
            search: "",
            results: [],
            loading: false,
        }
    },
    async created () {
        this.comments = (await CommentsService.index()).data
    },
    methods: {
        navigateTo (route) {
            this.$router.push(route)
        },
        async deleteComment (comment) {
            try {
                await CommentsService.delete(comment)
                this.refreshData()
            } catch (err) {
                console.log(err)
            }
        },
        async refreshData() {
            this.comments = (await CommentsService.index()).data
        }
    }
}
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
    .thumbnail-pic img{
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
        border:solid 1px #dfdfdf;
        margin-bottom: 10px;
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
        padding: 5px;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
    }
    .product-header {
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
    }

    #product-list-bottom{
        padding-top:4px;
    }

#product-list-bottom {
  padding: 10px;
  text-align: center;
  /*background: seagreen;*/
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
        background:paleturquoise;
        color: black;
        text-decoration: none;
    }
    .create-product {
        margin-top: 10px;
    }
    .categories li.clear a {
        background: tomato;
        color: white
    }
    .product-load-finished {
  padding: 4px;
  text-align: center;
  background: seagreen;
  color: white;
}
</style>