<template>
  <div  v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <TreeTools :props="defaultProps" :treeNode="company" :isRoot="true" @addDepts="addDepts"></TreeTools>
        <el-tree :data="departs" :props="defaultProps" :check-on-click-node="false">
          <!-- 传入内容 ==插槽内容  会循环多次，会根据节点循环多次-->
          <!-- 作用于插槽 slot-scope='obj' 接受传递给插槽的数据  data是每个节点的数据对象-->
          <TreeTools slot-scope="{data}" :treeNode="data" @delDepts="getDepartments" @addDepts="addDepts"
            @editDepts="editDepts">
          </TreeTools>
        </el-tree>
        <!-- 放置新增弹层组件 -->
        <AddDept ref="addDepts" :showDialog="showDialog" :treeNode="node" @addDepts="getDepartments" :showDialog.sync="showDialog" />
      </el-card>

    </div>
  </div>
</template>
  
<script>

import TreeTools from './component/tree-tools.vue';
import AddDept from './component/add-dept.vue'

import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
  components: {
    TreeTools, AddDept
  },
  data() {
    return {
      company: { name: '', manager: '' },
      defaultProps: {
        label: 'name',
        children: 'children',
      },
      departs: [],
      showDialog: false, //控制窗口显示隐藏
      node: null,     //记录当前点击的node节点
      loading: false // 用来控制进度弹层的显示和隐藏
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.loading = true
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(result.depts, '')
      this.loading = false
    },
    //监听tree tools触发的添加子部门事件
    addDepts(node) {
      this.showDialog = true   //显示弹层
      this.node = node
    },

    //监听editDepts方法
    editDepts(node) {
      this.showDialog = true //弹出层
      this.node = node
      //应该在这里获取部门详情的方法
      this.$refs.addDepts.getDepartDetail(node.id)
    }
  },
}
</script>
  
<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>