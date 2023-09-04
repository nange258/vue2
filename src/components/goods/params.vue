<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="color: #fff;">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item> 商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card class="box-card">
            <!-- 警示框 -->
            <el-alert title="注意！只允许为第三级分类设置相关参数！
" type="warning" show-icon :closable="false">
            </el-alert>
            <!-- 选择商品分类的区域 -->
            <el-row class="row_cat">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择框 -->
                    <el-cascader v-model="selectCateKeys" :options="caterList" :props="caterProps"
                        @change="handleChange"></el-cascader>
                </el-col>
            </el-row>
            <!-- tab切换 -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <!-- 添加动态参数面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnBled" class="btn"
                        @click="addDialogVisible = true">添加参数</el-button>
                    <!-- 动态数据表格 -->
                    <el-table :data="manyTabData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable
                                    @close="handClose(i, scope.row)"> {{
                                        item
                                    }}</el-tag>
                                <!-- 循环渲染标签 -->
                                <!-- 文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                                    ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New
                                    Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <!--     -->
                        <el-table-column label="参数名称 " prop="attr_name"></el-table-column>
                        <el-table-column label="操作 ">
                            <template slot-scope="scope">

                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="removeParams(scope.row.attr_id)">删除</el-button>

                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnBled" class="btn"
                        @click="addDialogVisible = true">静态属性</el-button>
                    <!--静态属性表格 -->
                    <el-table :data="onlyTabData" border stripe>
                        <el-table-column type="expand"></el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index">
                            <!-- 展开行 -->
                            <el-table-column type="expand">
                                <template slot-scope="scope">
                                    <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable
                                        @close="handClose(i, scope.row)"> {{
                                            item
                                        }}</el-tag>
                                    <!-- 循环渲染标签 -->
                                    <!-- 文本框 -->
                                    <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)">
                                    </el-input>
                                    <!-- 按钮 -->
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                        New
                                        Tag</el-button>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <!--     -->
                        <el-table-column label="属性名称 " prop="attr_name"></el-table-column>
                        <el-table-column label="操作 ">
                            <template slot-scope="scope">

                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="removeParams(scope.row.attr_id)">删除</el-button>

                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 动态参数/静态属性对话框 -->
        <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
            <!-- form 表单 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRuleForm" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改 动态参数/静态属性对话框 -->
        <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
            <!-- form 表单 -->
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRuleForm" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
    },
    data() {
        return {
            // 获取商品分类 的数据
            caterList: [],
            // 选择框配置对象
            caterProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
            },
            // 选择框双向绑定的数组
            selectCateKeys: [],
            // 被显示页面的name
            activeName: 'many',
            // 动态参数 的数据
            manyTabData: [],
            // 静态属性 的数据
            onlyTabData: [],
            // 动态参数/静态属性对话框
            addDialogVisible: false,
            // from 表单数据
            addForm: {
                attr_name: ''
            },
            // from 表单数据验证
            addFormRules: {
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                ],
            },
            // 修改 动态参数/静态属性对话框
            editDialogVisible: false,
            // 
            editForm: {
                attr_name: ''
            },
            // 
            editFormRules: {
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' },
                ],
            },
        };
    }, created() {
        this.getCaterList()
    },

    methods: {
        // 获取商品分类数据
        async getCaterList() {
            const { data: res } = await this.$http.get('categories')
            // console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败')
            }
            this.caterList = res.data
            // console.log(this.caterList);
        },
        // 选择框变化就会触发
        handleChange() {

            this.gtePremsData()
        },
        // tab点击事件的处理函数
        handleClick() {
            this.gtePremsData()
            // console.log(this.activeName);
        },
        // 获取数据
        async gtePremsData() {
            if (this.selectCateKeys.length !== 3) {
                this.selectCateKeys = []
                this.manyTabData = []
                this.onlyTabData = []
                return
            }
            // 获取参数具体数据
            const { data: res } = await this.$http.get(`categories/${this.catId}/attributes`, { params: { sel: this.activeName } })
            // console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('获取获取参数具体数据失败')
            }
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                item.inputVisible = false
                item.inputValue = ''
            });
            // 动态参数
            if (this.activeName == 'many') {
                this.manyTabData = res.data
            } else {
                this.onlyTabData = res.data
            }
        },
        //监听动态参数/静态属性对话框的关闭 
        addDialogClose() {
            this.$refs.addFormRuleForm.resetFields()
        },
        //监听 修改 动态参数/静态属性对话框的关闭 
        editDialogClose() {
            this.$refs.editFormRuleForm.resetFields()
        },
        // 发送数据
        addParams() {
            this.$refs.addFormRuleForm.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post(`categories/${this.catId}/attributes`, {
                    attr_name: this.addForm.attr_name,
                    attr_sel: this.activeName
                })
                if (res.meta.status !== 201) {
                    return this.$message.error('添加参数失败')
                }
                this.$message.success('添加参数成功')
            })
            this.addDialogVisible = false
            this.gtePremsData()
        },

        // 点击修改参数
        editParams() {
            this.$refs.editFormRuleForm.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.get(`categories/${this.catId}/attributes/${this.editForm.attr_id}`, {
                    attr_name: this.editForm.attr_name,
                    attr_sel: this.activeName
                })
                // console.log(1);
                // console.log(res);
                if (res.meta.status !== 200) {
                    return this.$message.error('修改参数失败')
                }
                this.$message.success('修改参数成功')
                this.gtePremsData()
                this.editDialogVisible = false
            })

            // console.log(1);
        },
        // 表单编辑 
        async showEditDialog(id) {
            this.editDialogVisible = true
            const { data: res } = await this.$http.get(`categories/${this.catId}/attributes/${id}`, {
                params: { attr_sel: this.activeName }
            })
            // console.log(1);
            if (res.meta.status !== 200) {
                return this.$message.error('修改参数失败')
            }
            this.editForm = res.data
        },

        // 表单删除
        async removeParams(id) {
            const res = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (res !== 'confirm') {
                return this.$message.error('已取消删除')
            }
            const { data: sss } = await this.$http.delete(`categories/${this.catId}/attributes/${id}`)
            if (sss.meta.status !== 200) {
                return this.$message.error('删除参数失败')
            }
            this.$message.success('删除参数成功')
            this.gtePremsData()
        },
        // 文本框显示隐藏
        async handleInputConfirm(row) {
            let inputValue = row.inputValue;
            // if (inputValue) {
            //     this.dynamicTags.push(inputValue);
            // }
            row.inputVisible = false;
            row.attr_vals.push(row.inputValue)
            row.inputValue = '';
            this.seaveAttrValus(row)

        },
        // 
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        async seaveAttrValus(row) {
            let { data: res } = await this.$http.put(`categories/${this.catId}/attributes/${row.attr_id}`, {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(' '),
            })
            if (res.meta.status !== 200) {
                return this.$message.error('修改参数失败')
            }
            this.$message.success('修改参数成功')
        },
        //  点击按钮显示文本框
        showInput(row) {
            row.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 删除标签
        handClose(i, row) {
            row.attr_vals.splice(i, 1)
            this.seaveAttrValus(row)
        },
    },

    computed: {
        // 按钮禁用启用
        isBtnBled() {
            if (this.selectCateKeys.length !== 3) {
                return true
            }
            return false
        },
        // 当前选中的三级id
        catId() {
            if (this.selectCateKeys.length == 3) {
                return this.selectCateKeys[2]
            }
            return null
        },
        // 动态计算标题
        titleText() {
            if (this.activeName == 'many') {
                return '动态参数'
            } else {
                return '静态属性    '
            }
        },
    },
};
</script>

<style scoped lang="less">
.el-card {
    margin-top: 20px;
    text-align: left;

    .row_cat {
        margin: 20px;
    }
}

.btn {
    margin-bottom: 20px !important;
}

.el-tag {
    margin: 5px;
}

.input-new-tag {
    width: 120px;
}
</style>
