<template>
  <div class="buttonPot" @click="btn(method)">
    <img :src="goodImg" alt />
    <span>{{font}}</span>
  </div>
</template>


<script>
export default {
  name: "Button",
  props:["img","font","method"],
  data() {
    return {
      goodImg: ""
    };
  },
  watch: {},
  computed: {},
  created() {
    var a = {
      close: require("../assets/images/btn/close.png"),
      open: require("../assets/images/btn/open.png"),
      reset: require("../assets/images/btn/reset.png"),
      modify: require("../assets/images/btn/modify.png"),
      detail: require("../assets/images/btn/detail.png"),
      export: require("../assets/images/btn/export.png"),
      add: require("../assets/images/btn/add.png"),
      addsolid: require("../assets/images/btn/addsolid.png"),
      cancle: require("../assets/images/btn/cancle.png"),
      check: require("../assets/images/btn/check.png"),
      add: require("../assets/images/btn/add.png"),
      addsolid: require("../assets/images/btn/addsolid.png"),
      delete: require("../assets/images/btn/delete.png"),
      money: require("../assets/images/btn/money.png"),
      openlock: require("../assets/images/btn/openlock.png"),
      lock: require("../assets/images/btn/lock.png"),
      text: require("../assets/images/btn/text.png"),
      textMoney: require("../assets/images/btn/textMoney.png"),
      qiyong: require("../assets/images/btn/qiyong.png"),
      nbmMoney: require("../assets/images/btn/nbmMoney.png")
    };
   
    this.goodImg = eval("a." + this.img);
  },

  methods: {
    btn() {
      this.$emit("click");
    }
  }
};
</script>


<style lang="less" scoped>
.buttonPot {
  background-color: #437dff;
  border-color: #437dff;
  color: white;
  margin-right: 20px;
  border-radius: 32px;

  font-size: 14px;
  font-weight: 400;
  text-align: center;

  cursor: pointer;
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 15px;
  img {
    width: 15px;
    height: 15px;
    margin-right: 3px;
  }
}
</style>