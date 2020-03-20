<template>
  <div class="about">
    <h1>{{ this.id ? '编辑' : '新建' }}广告位</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="model.items.push({})">
          <i class="el-icon-plus"></i> 添加广告
        </el-button>
        <el-row type="flex" style="flex-wrap: wrap">
          <el-col :md="12" v-for="(item, i) in model.items" :key="i">
            <el-form-item label="URL">
              <el-input v-model="item.url"></el-input>
            </el-form-item>
            <el-form-item label="图片" style="margin-top:1rem">
              <el-upload
                class="avatar-uploader"
                :action="$http.defaults.baseURL + '/upload'"
                :show-file-list="false"
                :on-success="res => $set(item, 'image', res.url)"
              >
                <img v-if="item.image" :src="item.image" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button
                size="small"
                type="danger"
                @click="model.items.splice(i, 1)"
                >删除</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
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
    return {
      model: {
        items: []
      }
    };
  },
  methods: {
    async save() {
      let res;
      if (this.id) {
        res = await this.$http.put(`rest/ads/${this.id}`, this.model);
      } else {
        res = await this.$http.post('rest/ads', this.model);
      }

      if (res) {
        this.$router.push('/ads/list');
        this.$message({
          type: 'success',
          message: '保存成功'
        });
      }
    },
    // 获取查询结果
    async fetch() {
      const res = await this.$http.get(`rest/ads/${this.id}`);
      this.model = { ...this.model, ...res.data };
    },
    async fetchParents() {
      const res = await this.$http.get('rest/ads');
      this.parents = res.data;
    }
  },
  // 在渲染组件时进行赋值
  created() {
    this.fetchParents();
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
