<template>
    <el-row type="flex" justify="space-between" style="width: 100%;">
        <el-col>
            <!-- 左侧内容 -->
            <span>{{ treeNode.name }} </span>
        </el-col>
        <el-col :span="4">
            <!-- 右侧内容 -->
            <el-row type="flex" justify="end">
                <el-col>
                    {{treeNode.manager}}
                </el-col>
                <el-col>
                    <el-dropdown @command="operateDepts">
                        <span class="el-dropdown-link">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                            <el-dropdown-item v-if="!isRoot" command="edit">编辑子部门</el-dropdown-item>
                            <el-dropdown-item v-if="!isRoot" command="del">删除子部门</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
    props: {
        //定义传入的属性
        treeNode: {
            required: true,
            type: Object
        },
        isRoot: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        //点击 编辑 删除 新增时触发
        operateDepts(type) {
            console.log(type);
            if (type === 'add') {
                //添加子部门
                this.$emit('addDepts', this.treeNode) //触发自定义事件告诉组件触发弹层
            } else if (type === 'edit') {
                //编辑子部门
                this.$emit('editDepts', this.treeNode) //触发自定义事件告诉组件触发弹层 点击谁 编辑谁
            } else {
                //删除子部门
                this.$confirm('您确定要删除该组织部门吗？').then(() => {
                    return delDepartments(this.treeNode.id)
                }).then(() => {
                    //等到成功的时候  后端数据变化了，前端没变化
                    this.$emit('delDepts') //触发触发自定义事件
                    this.$message.success('删除成功')
                })
            }
        }
    },
}
</script>

<style lang="scss" scoped>

</style>