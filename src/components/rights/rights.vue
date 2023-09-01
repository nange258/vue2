<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="color: #fff;">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item> 权限用管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card class="box-card">
            <template>
                <el-table :data="rifhtsList" style="width: 100%" border stripe>
                    <el-table-column type="index" label="" width="48">
                    </el-table-column>
                    <el-table-column prop="authName" label="权限名称">
                    </el-table-column>
                    <el-table-column prop="path" label="路径">
                    </el-table-column>
                    <el-table-column prop="level" label="权限等级">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.level == '0'">一级</el-tag>
                            <el-tag type="success" v-if="scope.row.level == '1'">二级</el-tag>
                            <el-tag type="warning" v-if="scope.row.level == '2'">三级</el-tag>
                        </template>

                    </el-table-column>
                </el-table>
            </template>
        </el-card>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            // 权限列表数据
            rifhtsList: []
        };
    },
    created() {
        // 调用函数
        this.getRigthList()
    },
    methods: {
        // 声明函数 获取数据
        async getRigthList() {
            const { data: res } = await this.$http.get('rights/list')
            // console.log(res);
            if (res.meta.status !== 200) {
                return this.$message.error('获取权限失败')
            }
            this.rifhtsList = res.data
            console.log(this.rifhtsList);
        }
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

.box-card {
    margin-top: 20px;
    // width: 480px;
    font-size: 12px;
}
</style>
