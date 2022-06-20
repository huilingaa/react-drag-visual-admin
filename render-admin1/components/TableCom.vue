<template>
  <div class="boxForm">
    <div class="list-box">
      <!-- top按钮 -->
      <div class="top">
        <div class="buttonPot" v-for="item in btnDatas" @click="btn(item.method)">
          <img :src="item.img" alt />
          <span>{{item.font}}</span>
        </div>
      </div>
      <!-- table -->
      <div class="table-con">
        <div class="table">
          <i-table
            :loading="loading"
            border
            stripe
            ref="selection"
            highlight-row
            @on-row-click="select"
            :columns="innerColumns"
            :data="data"
          >
            <template slot-scope="{ row, index }" slot="action">
              <div @click="show(row.fid)" class="tableSee">查看</div>
            </template>
          </i-table>
        </div>
        <div class="footer">
          <div class="left">总共：{{total}}条</div>
          <div class="right">
            <Page :total="total" :current="current" show-elevator @on-change="change"></Page>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CoreTable",
  props: ["btnData", "columns", "data", "loading", "total"],
  data() {
    return {
      innerColumns: [],
      selectData: {},
      current: 1,
      searching: {},
      btnDatas: {}
    };
  },
  mounted() {
    if (this.btnData) {
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

      var btnData = this.btnData.map((item, index) => {
        var newAry = {
          font: item.font,
          img: eval("a." + item.img),
          method: item.method
        };
        return newAry;
      });
      this.btnDatas = btnData;
    }
  },
  methods: {
    show(id) {
      this.$router.push({ path: "/member-chart", query: { id: id } });
    },
    btn(m) {
      this.$emit("clickBtn", m);
    },
    select(e) {
      this.selectData = e;
    },
    change(val) {
      this.current = val;
      this.$emit("getCur", val);
    },
    handleTable() {
      this.init(() => {
        // this.refresh();
      });
    },
    operation() {
      this.$emit("click");
    },
    init() {
      for (let i = 0; i < this.columns.length; i++) {
        let col = this.columns[i];
        if (col.hasOwnProperty("canShow") && col.canShow) {
          this.innerColumns.push(col);
        }
      }
    }
  }
};
</script>

<style>
.tableSee {
  cursor: pointer;
  color: #437dff;
}
</style>