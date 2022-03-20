<template>
  <div>
    <a-card class="card">
      <a-card-meta>
        <div class="title" slot="title">关于 <my-icon type="icon-guanyu" /></div>
        <div slot="description">
          <p>card content</p>
          <p>card content</p>
        </div>
      </a-card-meta>
    </a-card>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.card {
  margin-top: 5%;
  width: 100%;
}
.title {
  font-size: 16px;
  text-align: center;
  padding-top: 10px;
}

</style>