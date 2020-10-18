<template>
  <div>{{ msg }}</div>
</template>

<script>
export default {
  name: "topology",
  props: {
    msg: {
      type: String,
      default: "123"
    }
  }
};
</script>

<style lang="scss" scoped></style>
