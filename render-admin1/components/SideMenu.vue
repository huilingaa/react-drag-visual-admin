<template>
  <Menu ref="menu" theme="dark" active-key="资讯列表" accordion width="auto" :active-name="activeKey">
    <TreeMenu v-for="menu in menus" :menu="menu" :collapsed="collapsed" :key="menu.title"></TreeMenu>
  </Menu>
</template>

<script>
import TreeMenu from "./TreeMenu";
export default {
  name: "SideMenu",
  components: {
    TreeMenu
  },
  props: {
    menus: {
      type: Array,
      required: true
    },
    collapsed: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
    };
  },
  computed: {
    activeKey() {
      console.log(this.$route.meta.title);
      return this.$route.meta.title // 高亮
    }
  },
  methods: {},
  mounted() {
    this.$nextTick(() => {
      this.$refs.menu.updateOpened();
      this.$refs.menu.updateActiveName();
    });
  },
  created() {
    console.log(this.menus);
  }
};
</script>

