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
            <!-- 按钮 -->
            <el-button type="primary" class="btn" @click="showAddCate">添加分类</el-button>

            <!-- 表格 -->
            <tree-table :data="caterList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true"
                index-text="#" border :show-row-hover="false">
                <!-- 是否有效 -->
                <template slot="isok" slot-scope='scope'>
                    <i class="el-icon-success" v-if="scope.row.cat_deleted == false" style="color:lightskyblue;"></i>
                    <i class="el-icon-error" v-else style="color:red;"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope='scope'>
                    <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level == 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else="scope.row.cat_level == 2">三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt" slot-scope='scope'>
                    <el-button type="primary" icon="el-icon-edit" size="mini"
                        @click="showEdit(scope.row.cat_id, scope.row.cat_name)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"
                        @click="open(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页器  -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInof.pagenum" :page-sizes="[3, 5, 8, 10]" :page-size="queryInof.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="tota">
            </el-pagination>
        </el-card>

        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCatDialogVisible" width="50%" @close="addCataClose">
            <!--添加分类的表单  -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormrRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader v-model="selectedKeys" :options="ParentCateList" :props="cascaderProps"
                        @change="prendCateChange" :clearable="true"></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCatDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCata">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑用户 -->
        <el-dialog title="编辑用户" :visible.sync="useVisible" width="50%">
            <!-- 主体 -->
            <el-form label-width="70px" :model="rolesFrom" ref="rolesFromRef">
                <el-form-item label="分类名称">
                    <el-input v-model="rolesFrom.cat_name"></el-input>
                </el-form-item>
                <!--   <el-form-item label="角色描述">
                    <el-input v-model="rolesFrom.roleDesc"></el-input>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="useVisible = false">取 消</el-button>
                <el-button type="primary" @click="addues(rolesFrom.cat_id, rolesFrom.cat_name)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { Cascader } from 'element-ui';

export default {
    props: {

    },
    data() {
        return {
            // 查询条件
            queryInof: {
                type: 3,
                pagenum: 1,
                pagesize: 5,
            },
            // 数据列表
            caterList: [],
            // 总数据数量
            tota: 0,
            // table表格的指定列定义
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    type: 'template',
                    template: 'isok'
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'order'
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'opt'
                },
            ],
            // 编辑页面
            useVisible: false,
            //编辑页面数据对象
            rolesFrom: {
                rolesFromRef: {},
            },

            // 添加分类对话框显示隐藏
            addCatDialogVisible: false,
            // 添加分类的表单数据对象
            addCateForm: {
                // 将要添加分类的名称
                cat_name: '',
                // 父类分级的id
                cat_pid: 0,
                // 分类的等级 默认是添加的1级分类
                cat_level: 0,
            },
            // 添加分类的表单验证规则
            addCateFormRules: {
                cat_name: [
                    {
                        required: true, message: '请输入分类名称', trigger: 'blur'
                    }
                ],
            },
            // 父级分类列表的数据
            ParentCateList: [],
            // 选择器的配置对象
            cascaderProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
            },
            // 选中的父级id
            selectedKeys: [],
        };
    },
    created() {
        this.getCaterList()
    },
    methods: {
        // 获取数据
        async getCaterList() {
            const { data: res } = await this.$http.get('categories', { params: this.queryInof })
            // console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败')
            }
            this.caterList = res.data.result
            this.tota = res.data.total
        },
        // 监听分页i器
        handleSizeChange(newSiez) {
            this.queryInof.pagesize = newSiez
            this.getCaterList()
        },
        handleCurrentChange(newPage) {
            this.queryInof.pagenum = newPage
            this.getCaterList()
        },
        // 点击显示分类对话
        showAddCate() {
            this.getParentCateList()
            this.addCatDialogVisible = true

        },
        //  获取父级分类的数据列表
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
            if (res.meta.status !== 200) {
                return this.$message.error('获取父级分类的数据列表失败')
            }
            // console.log(res);
            this.ParentCateList = res.data
        },
        // 监听选择项
        prendCateChange() {
            if (this.selectedKeys.length > 0) {
                // console.log(this.addCateForm.cat_pid);
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                this.addCateForm.cat_level = this.selectedKeys.length
                return
            } else {
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }

        },
        // 点击添加新的分类
        addCata() {
            // console.log(1);
            this.$refs.addCateFormrRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post('categories', this.addCateForm)
                if (res.meta.status !== 201) {
                    return this.$message.error('添加分类失败')
                }
                this.$message.success('添加成功')
                this.getCaterList()
                this.addCatDialogVisible = false
            })
        },
        // 监听页面关闭
        addCataClose() {
            this.$refs.addCateFormrRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
        },
        // 修改编辑分类显示
        async showEdit(id, name) {
            console.log(name);
            this.useVisible = true
            const { data: res } = await this.$http.put('categories/' + id, {
                cat_name: name
            })
            console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('查询用户失败!!!')
            }
            this.rolesFrom = res.data
            // console.log(res.data);
        },
        // 表单提交前预验证
        addues(id, name) {
            this.$refs.rolesFromRef.validate(async vid => {
                console.log(id);
                console.log(name);

                if (!vid) return
                // 校验通过 发起请求
                const { data: res } = await this.$http.put('categories/' + id, {
                    cat_name: name
                })
                console.log(res);

                if (res.meta.status !== 200) {
                    return this.$message.error('更新用户信息失败')
                }
                this.useVisible = false;
                this.getCaterList();
                this.$message.success('更新成功');
            })
        },
        // 删除
        async open(id) {
            const rost = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
            ).catch(err => err)
            if (rost !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            console.log(id);
            const { data: res } = await this.$http.delete('categories/' + id)
            if (res.meta.status !== 200) {
                return this.$message.info('删除用户失败')
            }
            this.$message.success('删除成功'),
                this.getCaterList()
        },


    },
    components: {

    },
};
</script>

<style scoped lang="less">
.box-card {
    margin-top: 20px;
    // text-align: left;

    .btn {
        float: left;
        margin-bottom: 20px;
        // height: 40px;
    }

    .el-pagination {
        margin-top: 20px;
    }


}

.el-cascader {
    width: 100%;
}
</style>
