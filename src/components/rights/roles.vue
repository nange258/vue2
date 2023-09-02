<template>
    <div>
        <div>
            <!-- 面包屑 -->
            <el-breadcrumb separator-class="el-icon-arrow-right" style="color: #fff;">
                <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item> 权限用管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色列表</el-breadcrumb-item>
            </el-breadcrumb>

            <!-- 卡片视图 -->
            <el-card class="box-card">
                <el-button type="primary" @click="pushEdit">添加角色</el-button>
                <template>
                    <el-table :data="rolesList" style="width: 100%" border stripe>
                        <!-- 展开列表 -->
                        <el-table-column type="expand" label="" width="48">
                            <template slot-scope="scope">
                                <el-row class="vcenter" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                                    <!-- 一级权限 -->
                                    <el-col :span="6">
                                        <!-- v-for="tag in tags" :key="tag.name" closable :type="tag.type" -->
                                        <el-tag closable @close="removeRight(scope.row, item1.id)">
                                            {{ item1.authName }}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 二三级 -->
                                    <el-col :span="18">
                                        <el-row class="vcenter" v-for="(item2, i2) in item1.children" :key="item2.id">
                                            <!-- er级 -->
                                            <el-col :span="5">
                                                <el-tag type="success" closable @close="removeRight(scope.row, item2.id)">
                                                    {{ item2.authName }}
                                                </el-tag>
                                                <i class="el-icon-caret-right"></i>
                                            </el-col>
                                            <!-- san -->
                                            <el-col :span="19">
                                                <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id"
                                                    closable @close="removeRight(scope.row, item3.id)">
                                                    {{ item3.authName }}
                                                </el-tag>
                                            </el-col>
                                        </el-row>
                                    </el-col>

                                </el-row>
                                <!-- <pre></pre> -->
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="" width="48">
                        </el-table-column>
                        <el-table-column prop="roleName" label="角色名称">
                        </el-table-column>
                        <el-table-column prop="roleDesc" label="角色描述">
                        </el-table-column>
                        <el-table-column prop="level" label="操作" width="320px">
                            <!--  -->
                            <template slot-scope="scope ">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                    @click="showEdit(scope.row.id)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                    @click="open(scope.row.id)">删除</el-button>
                                <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSet(scope.row)">
                                    分配权限</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </template>
            </el-card>
            <!-- 修改用户 -->
            <el-dialog title="修改用户" :visible.sync="dialogVisible" width="50%">
                <!-- 主体 -->
                <el-form label-width="70px" :model="rolesFrom" ref="rolesFromRef">
                    <el-form-item label="角色名称">
                        <el-input v-model="rolesFrom.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述">
                        <el-input v-model="rolesFrom.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addues">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 添加用户 -->
            <el-dialog title="添加角色" :visible.sync="pushVisible" width="50%" @close="clpse">
                <!-- 主体 -->
                <el-form label-width="70px" :model="pushFrom" ref="pushFromRef" :rules="pushFormRuse">
                    <el-form-item label="名称" prop="roleName">
                        <el-input v-model="pushFrom.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="描述" prop="roleDesc">
                        <el-input v-model="pushFrom.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="pushVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUseInfo">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 对话框 -->
            <el-dialog title="分配权限" :visible.sync="setRight" width="50%" @close="setRightClosed">
                <!-- 树形图 -->
                <el-tree :data="reghtList" :props="treeProps" show-checkbox node-key="id" :default-expand-all="true"
                    :default-checked-keys="defKeys" ref="treeRef"></el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRight = false">取 消</el-button>
                    <el-button type="primary" @click="allotRights">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            // 角色列表数据
            rolesList: [],
            // 修改用户显示隐藏
            dialogVisible: false,
            // 添加显示隐藏
            pushVisible: false,
            // 分配权限对话框
            setRight: false,
            // 权限
            reghtList: [],
            // 权限id
            roleID: '',
            // 树形图
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            // 默认选中
            defKeys: [],
            // 请求的数据
            rolesFrom: {
                rolesFromRef: {},
            },
            // 添加的数据
            pushFrom: {
                roleName: '',
                roleDesc: '',
            },
            pushFormRuse: {
                roleName: [
                    {
                        required: true, message: '角色名称', trigger: 'blur'
                    },
                    {
                        min: 2,
                        max: 8,
                        message: '用户名的长度在2~8之间', trigger: 'blur'
                    }
                ],
                roleDesc: [
                    {
                        required: true, message: '角色描述', trigger: 'blur'
                    },
                    {
                        min: 4,
                        max: 15,
                        message: '用户名的长度在4   ~15之间', trigger: 'blur'
                    }
                ],
            }
        };
    },
    created() {
        // 调用函数
        this.getRolesList()
    },
    methods: {
        // 声明函数 获取数据
        async getRolesList() {
            const { data: res } = await this.$http.get('roles')
            // console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败')
            }
            this.rolesList = res.data
            // console.log(this.rolesList);
        },
        // 修改角色框显示
        async showEdit(id) {
            this.dialogVisible = true
            const { data: res } = await this.$http.get(`roles/${id}`)
            if (res.meta.status !== 200) {
                return this.$message.error('查询用户失败')
            }
            this.rolesFrom = res.data
            // console.log(res.data);
        },
        // 表单提交前预验证
        addues() {
            this.$refs.rolesFromRef.validate(async vid => {
                if (!vid) return
                // 校验通过 发起请求
                // console.log(this.rolesFrom);
                const { data: res } = await this.$http.put('roles/' + this.rolesFrom.roleId, {
                    roleName: this.rolesFrom.roleName,
                    roleDesc: this.rolesFrom.roleDesc
                })
                // console.log(res);

                if (res.meta.status !== 200) {
                    return this.$message.error('更新用户信息失败')
                }
                this.dialogVisible = false;
                this.getRolesList();
                this.$message.success('更新成功');
            })
        },
        // 点击显示页面
        pushEdit() {
            this.pushVisible = true
        },
        // // 重制表单 
        clpse() {

            // this.$refs.pushFromRef.resetFields()
            this.$refs.pushFromRef.resetFields()
            // console.log(2);
        },
        // 添加角色
        editUseInfo() {
            this.$refs.pushFromRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post('roles', {
                    roleName: this.pushFrom.roleName,
                    roleDesc: this.pushFrom.roleDesc,
                })

                // console.log(res);
                if (res.meta.status != 201) {
                    this.$message.error('更新用户添加失败')
                }
                this.$message.success('更新用户添加成功')
                this.pushVisible = false
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

            const { data: res } = await this.$http.delete('roles/' + id)
            if (res.meta.status !== 200) {
                return this.$message.info('删除用户失败')
            }
            this.$message.success('删除成功'),
                this.getRolesList()
        },
        // 根据对应的id删除对应权限
        async removeRight(role, right) {
            const rost = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
            ).catch(err => err)
            if (rost !== 'confirm') {
                return this.$message.info('已取消删除')
            }

            const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${right}`)
            if (res.meta.status !== 200) {
                return this.$message.info('删除用户失败')
            }
            this.$message.success('删除成功'),
                // this.getRolesList()
                role.children = res.data
        },
        // 展示分配权限 
        async showSet(role) {
            // console.log(role);
            this.roleID = role.id
            const { data: res } = await this.$http.get(`rights/tree`)
            if (res.meta.status !== 200) {
                return this.$message.info('获取权限失败')
            }
            this.reghtList = res.data
            this.getLeafKey(role, this.defKeys)
            // console.log(2);
            this.setRight = true
        },
        // // 获取所有选中的三级权限
        getLeafKey(node, arr) {
            // console.log(1);
            if (!node.children) {
                return arr.push(node.id)
            }

            node.children.forEach(item => this.getLeafKey(item, arr));
        },
        //监听对话框 
        setRightClosed() {
            this.defKeys = []
        },
        // 点击添加权限
        async allotRights() {
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ]
            const idStr = keys.join(',')
            const { data: res } = await this.$http.post(`roles/${this.roleID}/rights`, { rids: idStr })
            if (res.meta.status !== 200) {
                return this.$message.error('分配权限失败')
            }
            this.$message.success('分配权限成功')
            this.getRolesList()
            this.setRight = false
        },
    },
    components: {

    },
};
</script>

<style scoped lang="less">
.text {
    font-size: 14px;
}

.item {
    padding: 18px 0;
}

.bdtop {
    border-top: 1px solid #fff !important;
}

.bdbutton {
    border-bottom: 1px solid #fff !important;
}

.el-tag {
    margin: 7px;
}

.box-card {
    .el-button {
        float: left;
    }

    .el-table {
        margin-top: 60px;
        // text-align: center;
    }

    margin-top: 20px;
    // width: 480px;
    font-size: 12px;
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>
