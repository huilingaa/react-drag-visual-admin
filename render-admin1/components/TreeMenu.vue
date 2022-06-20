<template>
  <div v-if="menu!=null">
    <Submenu
      v-if="menu.children!=null && menu.children.length > 0"
      :name=" menu.title"
      :key="  menu.title"
    >
      <template slot="title">
        <span v-show="!collapsed">{{menu.title}}</span>
      </template>
      <TreeMenu
        v-for="child in menu.children"
        :menu="child"
        :collapsed="collapsed"
        :key="child.title"
      ></TreeMenu>
    </Submenu>
    <MenuItem
      v-else
      :key="menu.title"
      :name=" menu.title"
      :to="menu.routeName"
      v-show="!collapsed"
    >{{menu.title}}</MenuItem>
  </div>
</template>

<script>
export default {
  name: "TreeMenu",
  props: {
    menu: {
      type: Object,
      required: true
    },
    collapsed: {
      type: Boolean,
      required: true
    }
  }

};
</script>
