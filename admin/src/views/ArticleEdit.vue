<template>
  <div class="about">
    <h1>{{ this.id ? '编辑' : '新建' }}文章</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="文章类别">
        <el-select v-model="model.categories" multiple>
          <el-option
            v-for="item in categories"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章名">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="详情">
        <vue-editor
          useCustomImageHandler
          @image-added="uploadFile"
          v-model="model.body"
        ></vue-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor';

export default {
  data() {
    return { model: {}, categories: [] };
  },
  methods: {
    async save() {
      let res;
      if (this.id) {
        res = await this.$http.put(`rest/articles/${this.id}`, this.model);
      } else {
        res = await this.$http.post('rest/articles', this.model);
      }

      if (res) {
        this.$router.push('/articles/list');
        this.$message({
          type: 'success',
          message: '保存成功'
        });
      }
    },
    // 获取查询结果
    async fetch() {
      const res = await this.$http.get(`rest/articles/${this.id}`);
      this.model = res.data;
    },
    async fetchCategories() {
      const res = await this.$http.get('rest/categories');
      this.categories = res.data;
    },
    async uploadFile(file, Editor, cursorLocation, resetUploader) {
      // An example of using FormData
      // NOTE: Your key could be different such as:
      // formData.append('file', file)

      var formData = new FormData();
      formData.append('file', file);

      let res = await this.$http.post('upload', formData);
      Editor.insertEmbed(cursorLocation, 'image', res.data.url);
      resetUploader();
    }
  },
  // 在渲染组件时进行赋值
  created() {
    this.fetchCategories();
    this.id && this.fetch();
  },
  props: { id: {} },
  // 防止在edit时点击 新建分类 数据没有被清除！！
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    this.model = {};
    next();
  },
  components: {
    VueEditor
  }
};
</script>
