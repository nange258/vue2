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
            <!-- 查询列表区域 -->
            <el-row>
                <el-col :span="8">
                    <!-- input 框 -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- table表格区域 -->
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="100px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="100px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="150px">
                    <template slot-scope="scope">
                        {{ scope.row.add_time | dateForm }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                            @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页i器 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total" background>
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            // 提交的get参数
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10,
            },
            // 获取到的数据
            goodsList: [],
            // 数据总数
            total: 0,
        };
    },
    created() {
        this.getGoodsList()
    },
    methods: {
        // 根据分页i获取数据
        async getGoodsList() {
            let { data: res } = await this.$http.get('goods', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) {
                return this.$message.error('获取分页数据失败')
            }
            // this.$message.success('获取成功 ')
            this.goodsList = res.data.goods
            // console.log(res);
            this.total = res.data.total
        },
        // 
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        // 页码值发生变化
        handleCurrentChange(newPage) {

            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        // 根据id删除对应数据
        async removeById(id) {
            let sult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (sult !== 'confirm') {
                return this.$message.info('已经取消删除')
                // console.log(res);
            }
            let { data: res } = await this.$http.delete('goods/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('获取分页数据失败')
            }
            this.getGoodsList()
            // console.log(res);
        },
        // 去往添加商品页面
        goAddpage() {
            // this.$router.push('/home/goods/add.vue')
            this.$router.push('/home/add');
        },
    },
    components: {

    },
};
</script>

<style scoped lang="less">
.el-card {
    margin-top: 20px;
    // background-color: ;
}

.el-table {
    margin-top: 20px;
}

.el-pagination {
    margin-top: 20px;
}
</style>
