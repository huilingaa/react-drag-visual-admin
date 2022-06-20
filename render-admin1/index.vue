<template>
  <div class="list">
      <TopSelect ref="selectData" @selectBtn="getData" :columns="columns"></TopSelect>
      <TableCom
        ref="coreTable"
        :columns="columns"
        :data="data"
        :loading="loading"
        :total="total"
        @getCur="getCurNum"
      />
  
  </div>
</template>

<script>
import {selectadr} from "@/api/member";
export default {
  name: "AdminConfig",
  data() {
    return {
      keywords: "",
      loading: true,
      columns: [
        {
          title: "关键字",
          key: "keywords",
          stype: "string",
          canShow: false,
          canSearch: true
        },
        {
          title: "UID",
          key: "fid",
          canShow: true
        },
        {
          title: "登录名",
          key: "loginName",
          canShow: true,
          sortable: true
        },
        // {
        //   title: "会员昵称",
        //   key: "nickName",
        //   sortable: true
        // },
        {
          title: "手机号",
          key: "telephone",
          canShow: true,
          sortable: true
        },
        {
          title: "地址",
          canShow: true,
          key: "address"
        },
        {
          title: "创建时间",
          canShow: true,
          key: "createTime"
        }
      ],
      dataTemp: [],
      data: [],
      total: 0,
      current: 1
    };
  },
  methods: {
    getCurNum(data) {
      this.current = data;
      this.getData(this.dataTemp);
    },
    async getData(data) {
      this.dataTemp = data;
        selectadr({
          page: this.current,
          size: 10,
          keywords: !this.dataTemp ? '' : this.dataTemp.keywords
      }).then(res => {
        this.current=1;
        this.loading = false;
        this.data = res.data.data.records;
        this.total = res.data.data.total;
      })
    
    }
  },
  mounted() {
    this.$refs.coreTable.handleTable();
    this.getData();
  }
};
</script>

<style lang="less" scoped>
.item {
  padding: 20px 30px;
  display: flex;
  line-height: 2;
  .title {
    font-size: 22px;
    margin: 0 20px;
    img {
      padding-top: 4px;
      width: 4px;
      height: 20px;
      margin-right: 10px;
    }
    span {
      color: red;
    }
  }
  .noImg {
    margin-top: 10px;
    width: 238px;
    height: 150px;
    line-height: 150px;
    text-align: center;
    background: rgba(238, 238, 238, 1);
    border-radius: 10px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(48, 48, 48, 1);
  }
  .li {
    margin-top: 5px;
    width: 260px;
    margin-right: 80px;
    color: rgba(48, 48, 48, 1);
    font-size: 16px;
    font-weight: 500;
    span {
      color: rgba(48, 48, 48, 1);
      opacity: 0.7;
    }
  }
}
.tableSee {
  cursor: pointer;
  color: #437dff;
}
</style>
