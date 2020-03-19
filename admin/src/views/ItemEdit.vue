<template>
  <div class="about">
    <h1>{{ this.id ? '编辑' : '新建' }}物品</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="model.icon"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return { model: {} };
  },
  methods: {
    async save() {
      let res;
      if (this.id) {
        res = await this.$http.put(`rest/items/${this.id}`, this.model);
      } else {
        res = await this.$http.post('rest/items', this.model);
      }

      if (res) {
        this.$router.push('/items/list');
        this.$message({
          type: 'success',
          message: '保存成功'
        });
      }
    },
    // 获取查询结果
    async fetch() {
      const res = await this.$http.get(`rest/items/${this.id}`);
      this.model = res.data;
    }
  },
  // 在渲染组件时进行赋值
  created() {
    this.id && this.fetch();
  },
  props: { id: {} },
  // 防止在edit时点击 新建分类 数据没有被清除！！
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    this.model = {};
    next();
  }
};
</script>
