<template>
  <Modal
    ref="modal"
    :title="title"
    v-model="open"
    :fullscreen="isfullscreen"
    scrollable
    class="model"
    mask
    :width="width"
    :closable="false"
  >
    <div slot="header" class="titleTop">
      <div class="ivu-modal-header-inner" >{{title}}</div>
      <div class="right">
        <div class="icon" @click="full">
          <Icon :type="isfullscreen?'md-contract':'md-expand'" color="#999" size="16" />
        </div>
        <div class="icon" @click="cancle">
          <Icon type="md-close" color="#999" size="16" />
        </div>
      </div>
    </div>

    <Form ref="form" :model="form" :class="tag?'small box':'box'">
      <FormItem
        v-for="(item, index) in form.items"
        :key="item.key"
        :prop="'items.'+ index + '.value'"
        :rules="item.rules || []"
        :label="item.title"
        class="edit-col"
      >
        <template v-if="item.stype==='string'">
          <Input
            class="edit-input"
            clearable
            placeholder="请输入..."
            v-model="item.value"
            style="width:260px"
          />
        </template>
        <template v-else-if="item.stype==='stringD'">
          <Input
            class="edit-input"
            clearable
            placeholder="请输入..."
            v-model="item.value"
            disabled
            style="width:260px"
          />
        </template>
          <template v-else-if="item.stype==='stringNO'">
          <Input
            class="edit-input"
            clearable
            placeholder="请输入..."
            v-model="item.value"
            disabled
            style="display:none"
          />
        </template>

        <template v-else-if="item.stype==='text'">
          <Input
            class="edit-input"
            type="textarea"
            :rows="4"
            placeholder="请输入..."
            clearable
            v-model="item.value"
          />
        </template>

        <template v-else-if="item.stype==='int'">
          <InputNumber class="edit-input" v-model="item.value" :disabled="item.key==='id'" />
        </template>

        <template v-else-if="item.stype==='float'">
          <InputNumber class="edit-input" v-model="item.value" :step="0.00000001" />
        </template>

        <template v-else-if="item.stype==='bool'">
          <Switch class="edit-input" v-model="item.value"></Switch>
        </template>

        <template v-else-if="item.stype==='tree'">
          <div>
            <br />
            <Tree :data="dataModel" :expand="true" show-checkbox></Tree>
          </div>
        </template>

        <template v-else-if="item.stype==='update'" show-upload-list>
          <Upload action="http://120.24.255.86:9999">
            <Button icon="ios-cloud-upload-outline">选择文件</Button>
          </Upload>
        </template>

        <template v-else-if="item.stype==='Ueditor'">
          <div>
            <br />
            <VueUeditorWrap v-model="contents" :config="myConfig" />
          </div>
        </template>

        <template v-else-if="item.stype==='datetime'">
          <DatePicker
            class="edit-input"
            v-model="item.value"
            type="datetime"
            :options="options3"
            format="yyyy-MM-dd "
            placeholder="item.value"
          ></DatePicker>
        </template>

        <template v-else-if="item.stype==='select'"  >
          <Select v-model="item.value" class="edit-input" style='width:260px'>
            <Option
              v-for="(desc, value, index) in item.selectDict"
              :key="index"
              :value="parseInt(value)"
            >{{ desc }}</Option>
          </Select>
        </template>

        <!-- <Radio-group :model.sync="disabledGroup">
        <Radio value="金斑蝶" disabled></Radio>
        <Radio value="爪哇犀牛"></Radio>
        <Radio value="印度黑羚"></Radio>
        </Radio-group>-->
        <template v-else-if="item.stype==='radio'">
          <RadioGroup v-model="item.value" class="edit-input" :model.sync="disabledGroup">
            <Radio v-for="(value, index) in item.radioList" :key="index" :label="value"></Radio>
          </RadioGroup>
        </template>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button type="primary" @click="handleOk">提交</Button>
    </div>
  </Modal>
</template>
<script>
import { getDefaultByType } from "@/utils/utils";
import VueUeditorWrap from "vue-ueditor-wrap";
export default {
  props: {
    title: {
      type: String,
      required: true
    },

    columns: {
      type: Array,
      required: true
    },
    // modelLook: {
    //   type: String,
    //   required: true
    // },

    flag: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      dataModel: [
        {
          title: "虚拟通证交易所权限",
          expand: false,
          children: [
            {
              title: "虛擬幣操作管理",
              expand: false
            },
            {
              title: "会员管理",
              expand: false,
              children: [
                {
                  title: "会员列表",
                  expand: false,
                  children: [
                    {
                      title: "禁用"
                    },
                    {
                      title: "解除禁用"
                    },
                    {
                      title: "重新登陆密码"
                    },
                    {
                      title: "重新交易密码"
                    },
                    {
                      title: "重置GOOGLE"
                    },
                    {
                      title: "重置手机号码"
                    },
                    {
                      title: "导出"
                    }
                  ]
                },
                {
                  title: "待审核会员列表",
                  expand: false,
                  children: [
                    {
                      title: "审核"
                    },
                    {
                      title: "全部审核通过"
                    },
                    {
                      title: "全部审核不通过"
                    }
                  ]
                },
                {
                  title: "会员操作日志列表"
                },
                {
                  title: "委托交易列表"
                },
                {
                  title: "历史收盘价列表"
                },
                {
                  title: "推广收益列表"
                },

                {
                  title: "c2c订单列表"
                },
                {
                  title: "会员虚拟通证地址列表"
                },
                {
                  title: "会员资产记录列表"
                }
              ]
            },
            {
              title: "网站信息设置",
              expand: false
            },
            {
              title: "系统管理",
              expand: false,
              children: [
                {
                  title: "系统参数列表",
                  expand: false,
                  children: [
                    {
                      title: "修改"
                    }
                  ]
                },
                {
                  title: "帮助分类列表",
                  expand: false,
                  children: [
                    {
                      title: "修改"
                    }
                  ]
                },
                {
                  title: "角色列表",
                  expand: false,
                  children: [
                    {
                      title: "新增"
                    },
                    {
                      title: "修改"
                    }
                  ]
                },
                {
                  title: "app版本列表",
                  expand: false,
                  children: [
                    {
                      title: "修改"
                    }
                  ]
                },
                {
                  title: "积分奖励列表",
                  expand: false,
                  children: [
                    {
                      title: "新增"
                    },
                    {
                      title: "修改"
                    },
                    {
                      title: "删除"
                    }
                  ]
                },
                {
                  title: "权限列表",
                  expand: false,
                  children: [
                    {
                      title: "新增"
                    },
                    {
                      title: "修改"
                    },
                    {
                      title: "删除"
                    }
                  ]
                },
                {
                  title: "管理员列表",
                  expand: false,
                  children: [
                    {
                      title: "修改绑定手机号"
                    },
                    {
                      title: "新增"
                    },
                    {
                      title: "禁用"
                    },
                    {
                      title: "解除禁用"
                    },
                    {
                      title: "修改密码"
                    },
                    {
                      title: "修改角色"
                    }
                  ]
                },
                {
                  title: "限价交易列表"
                }
              ]
            },
            {
              title: "报表管理",
              expand: false,

              children: [
                {
                  title: "会员注册统计表"
                },
                {
                  title: "虚拟通证充值统计表"
                },
                {
                  title: "虚拟通证提现统计表"
                },
                {
                  title: "综合统计表"
                }
              ]
            },
            {
              title: "提问管理",
              expand: false,
              children: [
                {
                  title: "提问记录列表"
                },
                {
                  title: "待回复提问列表"
                }
              ]
            },
            {
              title: "test_01",
              expand: false
            },
            {
              title: "虚拟通证操作管理",
              expand: false,
              children: [
                {
                  title: "虚拟通证操作总表"
                },
                {
                  title: "会员虚拟通证列表"
                },
                {
                  title: "虚拟通证手工充值列表",
                  expand: false,
                  children: [
                    {
                      title: "新增"
                    },
                    {
                      title: "删除"
                    },
                    {
                      title: "修改"
                    }
                  ]
                },
                {
                  title: "虚拟通证充值列表"
                },
                {
                  title: "待审核虚拟通证提现列表",
                  expand: false,
                  children: [
                    {
                      title: "审核"
                    },
                    {
                      title: "锁定"
                    },
                    {
                      title: "取消锁定"
                    },
                    {
                      title: "取消提现"
                    }
                  ]
                },

                {
                  title: "虚拟通证类型列表",
                  expand: false,
                  children: [
                    {
                      title: "新增"
                    },
                    {
                      title: "禁用"
                    },
                    {
                      title: "启动"
                    },
                    {
                      title: "修改"
                    },
                    {
                      title: "修改手续费"
                    },
                    {
                      title: "测试钱包"
                    },
                    {
                      title: "生成钱包地址"
                    }
                  ]
                },
                {
                  title: "虚拟通证可用地址列表"
                },
                {
                  title: "虚拟通证成功提现列表"
                }
              ]
            },
            {
              title: "推荐管理",
              expand: false,
              children: [
                {
                  title: "推荐设置列表",
                  expand: false,
                  children: [
                    {
                      title: "新增"
                    },
                    {
                      title: "删除"
                    },
                    {
                      title: "修改"
                    }
                  ]
                }
              ]
            },
            {
              title: "资讯管理",
              expand: false,
              children: [
                {
                  title: "资讯列表",
                  expand: false,
                  children: [
                    {
                      title: "新增"
                    },
                    {
                      title: "删除"
                    },
                    {
                      title: "修改"
                    }
                  ]
                },
                {
                  title: "资讯类型",
                  expand: false,
                  children: [
                    {
                      title: "修改"
                    }
                  ]
                },
                {
                  title: "关于"
                }
              ]
            }
          ]
        }
      ],
      disabledGroup: "爪哇犀牛",
      options3: {
        disabledDate(date) {
          var a = [
            "2019-12-30",
            "2019-12-31",
            "2020-01-01",
            "2020-01-02",
            "2020-01-03",
            "2020-01-04",
            "2020-01-05",
            "2020-01-06",
            "2020-01-07",
            "2020-01-08"
          ];
          console.log(date);
          // data.indexOf(a) > -1;
          return date && date.valueOf(a) < -1;
        }
      },
      open: false,
      loading: true,
      form: {
        items: []
      },

      width: 520,
      contents: "<h2>Vue + UEditor + v-model双向绑定</h2>",
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: "100%",
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: "http://35.201.165.105:8000/controller.php",
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: "/UE/"
      },
      tag: false,
      isfullscreen: false
    };
  },
  components: {
    VueUeditorWrap
  },
  methods: {
    cancle() {
      this.open = false;
    },
    full() {
      this.isfullscreen = !this.isfullscreen;
    },
    show(data) {
      if (data != null) {
        for (let col of this.form.items) {
          col.value = data[col.key];
        }
      } else {
        for (let col of this.form.items) {
          col.value = getDefaultByType(col.stype);
        }
      }
      this.open = true;
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let data = {};
          for (let col of this.form.items) {
            data[col.key] = col.value;
          }
          this.$emit("saved", data);
          this.open = false;
        }
      });
    },
    init() {
      this.form.items = [];
      for (let i = 0; i < this.columns.length; i++) {
        let col = this.columns[i];
        if (!col.hasOwnProperty("canEdit") || !col["canEdit"]) {
          continue;
        }
        this.form.items.push(col);
      }
    }
  },
  created() {
    if (this.flag == "big") {
      this.width = 820;
      this.tag = true;
    }
    this.init();
  }
};
</script>

<style lang="less" >

.ivu-form .ivu-form-item-label {
  float: none;
}


.small {
  overflow: scroll;
  height: 740px;
}

.box {
  padding: 10px 20px;
}
.titleTop {
  display: flex;
  align-items: center;
  .right {
    display: flex;
    align-items: center;
    .icon {
      cursor: pointer;
      padding-left: 10px;
    }
  }
}
</style>
