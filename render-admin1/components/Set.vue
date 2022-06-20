<template>
  <div class="user-avator-dropdown">
    <Dropdown trigger="click" class="Tablist" @on-click="changeMenu">
      <div class="boxTOP">
        <img src="../assets/images/shezhi.png" alt />
        <p>设置</p>
      </div>
      <DropdownMenu slot="list">
        <DropdownItem name="home">网站首页设置</DropdownItem>
        <DropdownItem name="password">修改密码</DropdownItem>
        <DropdownItem name="moneyPwd">设置资金密码</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <ModelCom ref="one" title="网站信息设置" flag="canEdit" :columns="oneModel" @saved="home" />
    <ModelCom
      ref="two"
      title="修改管理员：admin密码"
      flag="canEdit"
      :columns="twoModel"
      @saved="handleSaved"
    />
    <ModelCom ref="there" title="设置资金密码" flag="canEdit" :columns="thereModel" @saved="handleSaved" />
  </div>
</template>


<script>
import ModelCom from "./ModelCom";
import { updateindexInfo, getindexInfo } from "@/api/other";
import { setDefaultByType } from "@/utils/utils";
export default {
  name: "Language",
  components: {
    ModelCom
  },
  data() {
    return {
      temp: [],
      oneModel: [
        {
          key: "fid",
          stype: "stringNO",
          value: "",
          canEdit: true
        },
        {
          title: "网站标题:",
          key: "title",
          stype: "string",
          value: "",
          canEdit: true
        },
        {
          title: "网站关键词:",
          key: "keywords",
          stype: "string",
          value: "",
          canEdit: true
        },
        {
          title: "网站描述:",
          key: "description",
          stype: "text",
          value: "",
          canEdit: true
        },
        {
          title: "备案号:",
          key: "beianinfo",
          stype: "string",
          value: "",
          canEdit: true
        },
        {
          title: "认证代码:",
          key: "systemMail",
          stype: "string",
          value: "",
          canEdit: true
        },
        {
          title: "copyRights:",
          key: "copyRights",
          stype: "string",
          value: "",
          canEdit: true
        }
      ],
      twoModel: [
        {
          title: "原密码：",
          key: "fname",
          stype: "string",
          value: "",
          canEdit: true,
          rules: [{ required: true, message: "请输入...", trigger: "blur" }]
        },
        {
          title: "新密码：",
          key: "keyWords",
          stype: "string",
          value: "",
          canEdit: true,
          rules: [{ required: true, message: "请输入...", trigger: "blur" }]
        },
        {
          title: "确认密码：",
          key: "description",
          stype: "text",
          value: "",
          canEdit: true,
          rules: [{ required: true, message: "请输入...", trigger: "blur" }]
        }
      ],
      thereModel: [
        {
          title: "原资金密码：",
          key: "fname",
          stype: "string",
          value: "",
          canEdit: true,
          rules: [{ required: true, message: "请输入...", trigger: "blur" }]
        },
        {
          title: "新资金密码：",
          key: "keyWords",
          stype: "string",
          value: "",
          canEdit: true,
          rules: [{ required: true, message: "请输入...", trigger: "blur" }]
        },
        {
          title: "确认资金密码：",
          key: "description",
          stype: "text",
          value: "",
          canEdit: true,
          rules: [{ required: true, message: "请输入...", trigger: "blur" }]
        }
      ]
    };
  },
  watch: {},
  computed: {},
  methods: {
    home(name) {
      updateindexInfo(name).then(res => {
        if (res.status == 200) {
          this.getData();
          this.$Message.info("操作成功");
        }
      });
    },
    handleSaved() {},
    changeMenu(name) {
      if (name == "home") {
        this.$refs.one.show(this.temp);
      } else if (name == "password") {
        this.$refs.two.show(null);
      } else {
        this.$refs.there.show(null);
      }
    },
    getData() {
      getindexInfo({
        page: 1,
        size: 10
      }).then(res => {
        this.temp = res.data.data[0];
        console.log(this.temp);
      });
    }
  },

  mounted() {
    this.getData();
  }
};
</script>


