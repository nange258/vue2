<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="color: #fff;">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item> 商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <!-- 查询列表区域 -->
            <el-row>
                <el-col :span="10">
                    <!-- input 框v-model="queryInfo.query" clearable @clear="getGoodsList" -->
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-table :data="ordersList" border stripe>
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="订单编号" prop="order_number" width="400px"></el-table-column>
                    <el-table-column label="订单价格" prop="order_price" width="90px"></el-table-column>
                    <el-table-column label="是否付款" prop="pay_status" width="90px">
                        <template slot-scope="scope">
                            <el-tag type="success" v-if="scope.row.pay_status == 1">已付款</el-tag>
                            <el-tag type="danger" v-else>未付款</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否发货" prop="is_send" width="90px"></el-table-column>
                    <el-table-column label="下单时间" prop="create_time" width="400px">
                        <template slot-scope="scope">{{ scope.row.create_time | dateForm }}</template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
                            <el-button type="success" icon="el-icon-location" size="mini"
                                @click="showProgressBox"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页器 -->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </el-row>
        </el-card>
        <!-- 修改地址对话框 -->
        <el-dialog title="修改地址" :visible.sync="ordersVisible" width="50%">
            <!-- from表单 -->
            <el-form :model="ordersForm" :rules="ordersFormRules" ref="ordersFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="name">
                    <el-input v-model="ordersForm.name"></el-input>
                </el-form-item>
                <el-form-item label="详细地址" prop="name2">
                    <el-input v-model="ordersForm.name2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="ordersVisible = false">取 消</el-button>
                <el-button type="primary" @click="ordersVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 展示物流进度 -->
        <el-dialog title="物流进度" :visible.sync="dialogVisible" width="50%" class="dia">
            <!-- <span>这是一段信息</span> -->
            <ul>
                <li>
                    <p class="to">已签收,感谢使用顺丰,期待再次为您服务</p>
                    <p class="bu">2018-05-10 09:39:00 </p>
                </li>
                <li>
                    <p class="to">[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件</p>
                    <p class="bu">2018-05-10 08:23:00</p>
                </li>
                <li>
                    <p class="to">快件到达 [北京海淀育新小区营业点]</p>
                    <p class="bu">2018-05-10 07:32:00 </p>
                </li>
                <li>
                    <p class="to">快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]</p>
                    <p class="bu"> 2018-05-10 02:03:00</p>
                </li>
                <li>
                    <p class="to">快件到达 [北京顺义集散中心]</p>
                    <p class="bu"> 2018-05-09 23:05:00</p>
                </li>
                <li>
                    <p class="to">快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]</p>
                    <p class="bu">2018-05-09 21:21:00 </p>
                </li>
                <li>
                    <p class="to">顺丰速运 已收取快件</p>
                    <p class="bu">2018-05-09 13:07:00 </p>
                </li>
                <li>
                    <p class="to">卖家发货</p>
                    <p class="bu">2018-05-09 12:25:03</p>
                </li>
                <li>
                    <p class="to">您的订单将由HLA（北京海淀区清河中街店）门店安排发货。</p>
                    <p class="bu">2018-05-09 12:22:24</p>
                </li>
                <li>
                    <p class="to">商品已经下单</p>
                    <p class="bu">2018-05-08 21:36:04</p>
                </li>
            </ul>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10,
            },
            // 总数居条数
            total: 0,
            // 获取到的参数 
            ordersList: [],
            // 对话框显示
            ordersVisible: false,
            dialogVisible: false,
            // 物流数据
            progreesInfo: [],
            // from表单
            ordersForm: {
                name: [],
                name2: '',
            },
            ordersFormRules: {
                name: [
                    { required: true, message: '请选择地址', trigger: 'blur' },
                ],
                name2: [
                    { required: true, message: '请选择详细地址', trigger: 'blur' },
                ],
            },
        };
    },

    mounted() {
        this.getOrderList()
    },
    methods: {
        // 获取数据
        async getOrderList() {
            let { data: res } = await this.$http.get('orders', { params: this.queryInfo })
            if (res.meta.status !== 200) {
                return this.$message.error('获取订单数据列表数据失败')
            }
            console.log(res);
            this.ordersList = res.data.goods
            this.total = res.data.total
        },
        // 分页器
        handleSizeChange(siz) {
            this.queryInfo.pagesize = siz
            console.log(siz);
            this.getOrderList()
        },
        handleCurrentChange(pag) {
            this.queryInfo.pagenum = pag
            console.log(pag);
            this.getOrderList()
        },
        // 显示对话框
        showBox() {
            this.ordersVisible = true
        },
        // 显示展示物流进度
        async showProgressBox() {
            // let { data: res } = await this.$http.get('/kuaidi/1106975712662')
            // if (res.meta.status !== 200) {
            //     return this.$message.error('获取物流进度失败')
            // }
            // console.log(res);
            // this.progreesInfo = res.data
            // console.log(this.progreesInfo);
            this.dialogVisible = true
        },
    },
    components: {

    },
};
</script>

<style scoped lang="less">
.el-card {
    margin-top: 20px;
}

.el-table {
    margin: 20px 0;
}

.dia {
    padding: 20px;
    text-align: left;

    ul {
        padding: 20px;

        li {
            margin: 10px 0;

            .bu {
                font-size: 12px;
                color: #999;
            }
        }
    }
}
</style>
