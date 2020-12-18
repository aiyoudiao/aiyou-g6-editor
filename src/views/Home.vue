<template>
  <div class="aiyou-editor">
    <router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src

import Editor from "@/components/Editor";

export default {
  name: "Home",
  components: {
    Editor
  }
};
</script>
