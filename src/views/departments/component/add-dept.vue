<template>
    <!-- 放置弹层组件 -->
    <el-dialog :title="showTitle" :visible="showDialog" style="width:100%" @close="btnCancel" center>
        <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
            <el-form-item label="部门名称" prop="name">
                <el-input v-model.lazy="formData.name" style="width:80%" placeholder="1-50个字符"></el-input>
            </el-form-item>
            <el-form-item label="部门编码" prop="code">
                <el-input v-model.lazy="formData.code" style="width:80%" placeholder="1-50个字符" />

            </el-form-item>
            <el-form-item label="部门负责人" prop="manager">
                <el-select v-model.lazy="formData.manager" placeholder="请选择" @focus="getEmployessSimple">
                    <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
                </el-select>
            </el-form-item>
            <el-form-item label="部门介绍" prop="introduce">
                <el-input v-model.lazy="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea"
                    :rows="3"></el-input>
            </el-form-item>
        </el-form>
        <!-- 确定和取消 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="btnCancel">取 消</el-button>
            <el-button type="primary" @click="btnOk">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployessSimple } from '@/api/employess'

export default {
    data() {
        //检查部门名称是否重复
        const checkNameRepeat = async (rule, value, callback) => {
            //value是部门名称 要和同级下的部门去比较，有没有相同的。有相同的不能通过
            const { depts } = await getDepartments()
            //获取数组之后 去找同级部门下的有没有和value相同的数据
            //找同级部门所有子部门
            let isRepeat = false
            if (this.formData.id) {
                //have id is edit 同级部门下我的名字不能和其他的同级部门名字进行重复
                //首先找到我的同级部门。 this.formData.id就是我的id 我的pid是this.formData.pid
                isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
            } else {
                isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
            }

            //如果isRepeat为true，找到一样的名字，不让通过
            isRepeat ? callback(new Error(`同级部门下已经存在这个${value}了`)) : callback()
        }

        //检查部门代码是否重复
        const checkCodeRepeat = async (rule, value, callback) => {
            //value是部门名称 要和同级下的部门去比较，有没有相同的。有相同的不能通过
            const { depts } = await getDepartments()
            let isRepeat = false
            if (this.formData.id) {
                //have id is edit
                //要求不能有一样的code
                isRepeat = depts.filter(item =>item.id !== this.treeNode.id).some(item => item.code === value && value )
            } else {
                //要求编码和所有部门编码都不能重复， 由于历史数据有可能没有code 所以说这里加一个强制性条件，就是value值不能为空
                isRepeat = depts.some(item => item.code === value && value)
            }
            isRepeat ? callback(new Error(`同级部门下已经存在这个${value}了`)) : callback()
        }
        return {
            //定义表单数据
            formData: {
                name: '',
                code: '',
                manager: '',
                introduce: '',
            },
            //校验规则
            rules: {
                name: [
                    { required: true, message: '部门名称不能为空', trigger: 'blur' },
                    { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
                    { trigger: 'blur', validator: checkNameRepeat }
                ],
                code: [
                    { required: true, message: '部门编码不能为空', trigger: 'blur' },
                    { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
                    { trigger: 'blur', validator: checkCodeRepeat }
                ],
                manager: [
                    { required: true, message: '部门负责人不能为空', trigger: 'blur' }
                ],
                introduce: [
                    { required: true, message: '部门介绍不能为空', trigger: 'blur' },
                    { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }
                ]
            },
            dialogVisible: false,
            value: '',
            peoples: [], //接受员工简单数据
        };
    },
    props: {
        showDialog: {
            type: Boolean,
            default: false,
        },
        treeNode: {
            type: Object,
            default: null
        }
    },
    computed: {
        showTitle() {
            return this.formData.id ? '编辑部门' : '新增子部门'
        }
    },
    methods: {
        async getEmployessSimple() {
            this.peoples = await getEmployessSimple()
        },
        async getDepartDetail(id) {
            //调用查询部门信息接口
            this.formData = await getDepartDetail(id)
            //因为是在父组件调用子组件方法， 先设置node数据，直接调用方法  
            //props是异步的，有可能取不到值所以不能写this.treeNode.id
        },
        btnOk() {
            this.$refs.deptForm.validate(async isOk => {
                if (isOk) {
                    //表单校验通过
                    //判断是否有id
                    if (this.formData.id) {
                        //有id就是编辑
                        await updateDepartments(this.formData)
                    } else {
                        //解构当前表单数据并且新增pid
                        await addDepartments({ ...this.formData, pid: this.treeNode.id })
                    }
                    //以上只是数据库新增了，但是页面没更新
                    //自定义事件触发告诉父组件重新拉取
                    this.$emit('addDepts')
                    //此时应该修改Dialog值的布尔值
                    //update.props
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    })
                    this.$emit('update:showDialog', false) //触发事件
                    //关闭dialog的时候会触发el-dialog的close事件

                }
            })
        },
        btnCancel() {
            this.formData = {
                name: '',
                code: '',
                manager: '',
                introduce: '',
            },
                //清除校验信息
                this.$refs.deptForm.resetFields()
            //关闭弹层
            this.$emit('update:showDialog', false) //触发事件
        }
    },
}
</script>

<style lang="scss" scoped>
.el-dialog__footer {
    display: flex;
    justify-content: center;
}
</style>