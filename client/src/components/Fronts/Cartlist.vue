<template>
  <div id="carlist">
    <main-header navsel="front"></main-header>
    <div class="user-info">
      <br />
      <br />
      <h1>แสดงข้อมูลผู้ใช้งาน</h1>
      <div class="form-wrapper" v-if="user != null">
        <div class="form-horizontal">
          <div class="form-group">
            <label for class="control-label col-md-2">Name:</label>
            <div class="col-md-8">
              <input
                class="form-control"
                type="text"
                v-model="user.name"
                disabled
              />
            </div>
          </div>
          <div class="form-group">
            <label for class="control-label col-md-2">Lastname:</label>
            <div class="col-md-8">
              <input
                class="form-control"
                type="text"
                v-model="user.lastname"
                disabled
              />
            </div>
          </div>
          <div class="form-group">
            <label for class="control-label col-md-2">Email:</label>
            <div class="col-md-8">
              <input
                class="form-control"
                type="email"
                v-model="user.email"
                disabled
              />
            </div>
          </div>
          <div class="form-group">
            <label for class="control-label col-md-2">address:</label>
            <div class="col-md-8">
              <input
                class="form-control"
                type="text"
                v-model="user.address"
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- cart info -->
    <div v-if="transections.length" class="cart-info container">
      <div class="rows">
        <div class="col-md-12">
          <div class="transection-wrapper">
            <h4>รายละเอียดการสั่ง</h4>
            <ul class="trasection-list">
              <li v-for="transection in transections" v-bind:key="transection.id" >
                <h4> {{ transection.producttitle }} จํานวน {{ transection.qty }} x {{ transection.prices }}
                </h4>
                <p>
                  <strong>ราคารวม :</strong> {{ (transection.qty * transection.prices) | getNumberWithCommas }}บาท
                </p>
                <p>
                  <strong>สถานะลูกค้า :</strong> {{ transection.clientStatus }} 
                </p>
                <p>
                  <div>
                      <form enctype="multipart/form-data" novalidate>
                          <div class="dropbox">
                              <input type="file" multiple :name="uploadFieldName"
                              :disabled="isSaving" @change="filesChange($event.target.name,
                              $event.target.files); fileCount = $event.target.files.length"
                              accept="image/*" class="input-file">
                          </div>
                      </form>
                  </div>
                </p>
                <p>
                  <transition name="fade">
                    <div class="thumbnail-pic" v-if="transection.pictures != 'null'">
                      <img class="img-thumbnail" height="120px" width="170px" :src="BASE_URL+transection.pictures" alt="thumbnail">
                    </div>
                  </transition>
                </p>
                <p>
                  <strong>***โปรดพิมพ์ชื่อรูปภาพอีกครั้งเพื่อยืนยัน***</strong>
                </p>
                <p>
                  {{ uploadedFileNames }}
                </p>
                <p>
                  <transition name="fade">
                    <!--<div class="thumbnail-pic" v-if="transection.pictures == 'null'">-->
                      <input class="" type="text" v-model="buy.pictures"  >
                    <!--</div>-->
                  </transition>
                </p>
                <p>
                  <button v-on:click.prevent="sendPaid(transection.id)" class="btn btnxs btn-success" > ยืนยันการชําระเงิน </button>
                </p>
                <p>
                  <strong>สถานะร้านค้า :</strong> {{ transection.shopStatus }}
                </p>
                
                <p>
                  <transition name="fade">
                    <div class="thumbnail-pic" v-if="transection.trackingnumber != 'null' && transection.trackingnumber != '' ">
                      <strong>trackingnumber :</strong> {{ transection.trackingnumber }}
                    </div>
                  </transition>
                </p>
                <p>
                  <strong>วันที่ :</strong> {{ transection.createdAt | formatedDate }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="container">
      <div class="trasection-null">ไม่มีรายการสั่งซื้อขณะนี้</div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import BuysService from "@/services/BuysService";
import moment from "moment";
import UploadService from "@/services/UploadService";
const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;
export default {
  filters: {
    formatedDate(value) {
      return moment(String(value)).format("DD-MM-YYYY");
    },
    getNumberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  computed: {
    ...mapState(["isUserLoggedIn", "user"]),
  },
  data() {
    return {
      transections: [],
      
      BASE_URL: "http://localhost:8081/assets/uploads/",
      error: null,
      // uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "userPhoto",
      uploadedFileNames: [],
      buy: {
        pictures: ""
      },
    };
  },
  async created() {
    this.transections = (await BuysService.user(this.user.id)).data;
    console.log(this.transections);
    this.reset();
  },
  mounted() {
    if (!this.isUserLoggedIn) {
      alert("Please, Register or Login before.\n\nThank you.");
      this.$router.push({
        name: "front",
      });
    }
  },
  methods: {
    async sendPaid(id) {
      let transection = {
        id: id,
        clientStatus: "ชําระแล้ว",
        pictures: this.buy.pictures
      };
      try {
        await BuysService.put(transection);
        this.refreshData();
      } catch (error) {
        console.log(error);
      }
    },
    async refreshData() {
      this.transections = (await BuysService.user(this.user.id)).data;
    },
    async save(formData) {
      // upload data to the server
      try {
        
        this.currentStatus = STATUS_SAVING;
        await UploadService.upload(formData);
        this.currentStatus = STATUS_SUCCESS;
        uploadedFileNames = ""
      } catch (error) {
        console.log(error);
        this.currentStatus = STATUS_FAILED;
      }
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      const formData = new FormData();

      if (!fileList.length) return;

      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map((x) => {
        formData.append(fieldName, fileList[x], fileList[x].name);
        this.uploadedFileNames.push(fileList[x].name);
      });

      // save it
      this.save(formData);
    },

    
  },
  computed: {
    ...mapState([
      'isUserLoggedIn',
      'user'
    ]),
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    }
  },
};
</script>
<style scoped>
.user-info h1 {
  text-align: center;
}
.trasection-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.trasection-list li {
  border: solid 1px #dfdfdf;
  margin-bottom: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.cart-info {
  margin-top: 50px;
}
.trasection-null {
  border: solid 1px #dfdfdf;
  margin-bottom: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  margin-top: 30px;
}
</style>