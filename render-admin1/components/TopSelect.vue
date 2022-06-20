<template>
  <div class="search-con">
    <!-- 上面的查询 -->
    <template>
      <div
        class="search-col list-top"
        v-for="col in columns"
        :key="col.key"
        v-if="col.hasOwnProperty('canSearch') && col.canSearch"
      >
        <span style=" padding-right:10px">{{col.title}}{{col.titleDes}}：</span>

        <template v-if="col.stype==='string'||col.stype==='stringD'">
          <Input class="search-input" clearable placeholder="请输入..." v-model="searching[col.key]" />
        </template>

        <template v-else-if="col.stype==='text'">
          <Input class="search-input" clearable placeholder="请输入..." v-model="searching[col.key]" />
        </template>

        <template v-else-if="col.stype==='int'">
          <InputNumber class="search-input" v-model="searching[col.key]" />
        </template>

        <template v-else-if="col.stype==='float'">
          <InputNumber class="search-input" v-model="searching[col.key]" :step="0.00000001" />
        </template>

        <template v-else-if="col.stype==='bool'">
          <Switch class="search-input" v-model="searching[col.key]"></Switch>
        </template>

        <template v-else-if="col.stype==='datetime'">
          <DatePicker
            style="width: 100px"
            class="search-input"
            v-model="searching[col.key]"
            type="datetime"
            format="yyyy-MM-dd "
            placeholder="选择日期"
          ></DatePicker>
        </template>

        <template v-else-if="col.stype==='select'">
          <Select v-model="searching[col.key]" class="search-input">
            <Option :key="-1" :value="0">全部</Option>
              <!-- <Option :key="-1" :value="-1">全部</Option> -->
            <Option
              v-for="(desc, value, index) in col.selectDict"
              :key="index"
              :value="parseInt(value)"
            >{{ desc }}</Option>
          </Select>
        </template>

        <template v-else-if="col.stype==='daterange'">
          <DatePicker
            class="search-input"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            placeholder="选择日期范围"
            @on-change="(dates)=>{ searching[col.key + 'Begin'] = dates[0]; searching[col.key + 'End'] = dates[1]; }"
          ></DatePicker>
        </template>

        <template v-else-if="col.stype==='radio'">
          <RadioGroup v-model="searching[col.key]" class="search-input">
            <Radio v-for="(value, index) in col.radioList" :key="index" :label="value"></Radio>
          </RadioGroup>
        </template>
      </div>
      <i-button
        class="button"
        style=" margin-left: 20px"
        type="primary"
        @click="handleSearch"
        shape="circle"
      >查询</i-button>
    </template>
  </div>
</template>

<script>
export default {
  name: "CoreTable",
  props: {
    columns: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      searching: {
        logType: 0
      }
    };
  },
  methods: {
    handleSearch() {
      if (this.searching.startDate) {
        this.searching.startDate = this.tt(this.searching.startDate);
      }
      if (this.searching.endDate) {
        this.searching.endDate = this.tt(this.searching.endDate);
      }
      if (this.searching.changeDate) {
        this.searching.changeDate = this.tt(this.searching.changeDate);
      }
      console.log(this.searching);
      this.$emit("selectBtn", this.searching);
      // this.searching = {
      //   logType: 0
      // };
    },
    tt(time) {
      var d = new Date(time);

      return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    }
  }
};
</script>

<style lang="less" scoped>
.search-con {
  .search {
    &-col {
      display: inline-block;
      margin-right: 25px;
    }
    &-input {
      display: inline-block;
      width: 220px;
    }
  }
}
</style>
