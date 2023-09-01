<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="color: #fff;">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item style="color: #fff"> 用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <div style="margin-top: 15px;">
                <el-row :gutter="15">
                    <el-col :span="10">
                        <el-input placeholder="请输入内容" v-model="quer.query" clearable @clear="getshuju">
                            <el-button slot="append" icon="el-icon-search" @click="getshuju"></el-button>
                        </el-input></el-col>
                    <el-col :span="4">
                        <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                    </el-col>
                </el-row>
            </div>
            <template>
                <el-table :data="usersList" style="width: 100%" border stripe>
                    <el-table-column type="index" label="" width="48">
                    </el-table-column>
                    <el-table-column prop="username" label="姓名">
                    </el-table-column>
                    <el-table-column prop="email" label="邮箱">
                    </el-table-column>
                    <el-table-column prop="mobile" label="电话">
                    </el-table-column>
                    <el-table-column prop="role_name" label="角色">
                    </el-table-column>
                    <el-table-column prop="mg_state" label="状态">
                        <template slot-scope="scope ">
                            <el-switch v-model="scope.row.mg_state" @change="mg_stateChange(scope.row)">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope ">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                @click="showEdit(scope.row.id)"></el-button>
                            <el-button type="danger " icon="el-icon-delete" size="mini"
                                @click="open(scope.row.id)"></el-button>
                            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                            </el-tooltip>

                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="quer.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="quer.pagesize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>
        <!-- 添加用户 -->
        <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%">
            <!-- 主体 -->
            <el-form :model="addForm" :rules="addFormRuse" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addues">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户 -->
        <el-dialog title="修改用户" :visible.sync="useVisible" width="50%" @close="clpse">
            <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editFrom.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editFrom.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editFrom.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="useVisible = !useVisible">取 消</el-button>
                <el-button type="primary" @click="editUseInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template> 

<script>
export default {
    props: {

    },
    data() {
        let emil = (rule, vale, cd) => {
            const emil = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (emil.test(vale)) {
                return cd()
            }
            cd(new Error('请输入合法的邮箱 '))
        }
        let moble = (rule, vale, cd) => {
            const reg = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (reg.test(vale)) {
                return cd()
            }
            cd(new Error('请输入合法的手机号 '))
        }

        return {
            quer: {
                query: '',
                pagenum: 1,
                pagesize: 2
            },
            usersList: [],
            total: 0,
            // 添加用户显示隐藏
            dialogVisible: false,
            // 修改用户显示隐藏
            useVisible: false,
            // 查询到的用户数据
            editFrom: {
                editFromRef: {},
            },
            editFromRules: {
                email: [
                    {
                        required: true, message: '请输入邮箱', trigger: 'blur'
                    }, {
                        validator: emil, trigger: 'blur'
                    }
                ],
                mobile: [
                    {
                        required: true, message: '请输入手机号', trigger: 'blur'
                    },
                    {
                        validator: moble, trigger: 'blur'
                    }
                ],
            },
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            addFormRuse: {
                usename: [
                    {
                        required: true, message: '请输入用户名', trigger: 'blur'
                    },
                    {
                        min: 4,
                        max: 10,
                        message: '用户名的长度在3~10之间', trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true, message: '请输入密码', trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 15,
                        message: '用户名的长度在6~15之间', trigger: 'blur'
                    }
                ],
                email: [
                    {
                        required: true, message: '请输入邮箱', trigger: 'blur'
                    }, {
                        validator: emil, trigger: 'blur'
                    }
                ],
                mobile: [
                    {
                        required: true, message: '请输入手机号', trigger: 'blur'
                    },
                    {
                        validator: moble, trigger: 'blur'
                    }
                ],
            }
        };
    },
    created() {
        this.getshuju()
    },
    methods: {
        async getshuju() {
            const { data: res } = await this.$http.get('users', {
                params: this.quer
            })
            if (res.meta.status !== 200) {
                return this.$message.error('数据获取失败')
            }
            this.usersList = res.data.users
            this.total = res.data.total

        },
        handleSizeChange(newSize) {
            this.quer.pagesize = newSize
            this.getshuju()
        },
        handleCurrentChange(newPage) {
            this.quer.pagenum = newPage
            this.getshuju()
        },
        async mg_stateChange(uese) {
            const { data: res } = await this.$http.put(`users/${uese.id}/state/:${uese.mg_state}`)

            if (res.meta.status !== 200) {
                uese.mg_state = !uese.mg_state
                return this.$message.error('更新用户状态失败')
            }
            this.$message.success('更新用户状态成功')
        },

        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        dialogclose() {
            this.$refs.addFormRef.resetFields()
        },
        addues() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post('users', this.addForm)
                console.log(res);
                if (res.meta.status != 201) {
                    this.$message.error('更新用户添加失败')
                }
                this.$message.success('更新用户添加成功')
                this.dialogVisible = false
            })
        },
        // 修改用户框显示
        async showEdit(id) {
            console.log(id);
            this.useVisible = true
            const { data: res } = await this.$http.get(`users/${id}`)
            if (res.meta.status !== 200) {
                return this.$message.error('查询用户失败')
            }
            this.editFrom = res.data
        },
        // 重制表单 
        clpse() {
            this.$refs.editFromRef.resetFields()
        },
        // 表单提交前预验证
        editUseInfo() {
            this.$refs.editFromRef.validate(async vid => {
                if (!vid) return
                // 校验通过 发起请求
                const { data: res } = await this.$http.put('users/' + this.editFrom.id, {
                    email: this.editFrom.email,
                    mobile: this.editFrom.mobile
                })

                if (res.meta.status !== 200) {
                    return this.$message.error('更新用户信息失败')
                }
                this.useVisible = false;
                this.getshuju();
                this.$message.success('更新成功');
            })
        },
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

            const { data: res } = await this.$http.delete('users/' + id)
            if (res.meta.status !== 200) {
                return this.$message.info('删除用户失败')
            }
            this.$message.success('删除  成功'),
                this.getshuju()
        },


    },
    components: {

    },
};
</script>

<style scoped lang="less">
.custom-breadcrumb .el-breadcrumb-item {
    color: red;
}


.el-card {
    margin-top: 20px;
}

.text {
    font-size: 14px;
}

.item {
    padding: 18px 0;
}

.box-card {

    .el-table {
        margin-top: 20px;
        font-size: 12px;
    }

    .block {
        margin-top: 10px;
    }

    // padding: 20px;

    // .el-input {
    //     // float: left;
    //     width: 400px;
    //     height: 40px;
    //     // text-align: left;
    // }
}
</style>
