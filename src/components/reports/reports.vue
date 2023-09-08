<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="color: #fff;">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item> 数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <div id="main" style="width: 600px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
    props: {

    },
    data() {
        return {
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        };
    },
    async mounted() {
        // 获取echarts数据
        let { data: res } = await this.$http.get('reports/type/1')
        //初始化 echarts
        var myChart = echarts.init(document.getElementById('main'))
        //  准备数据和配置项
        let sul = _.merge(res.data, this.options)

        // 展示数据
        // myChart.setOption(sul)
        myChart.setOption(sul);
    },
    methods: {
    },
    components: {

    },
};
</script>

<style scoped lang="less">
.el-card {
    margin-top: 20px;
}
</style>
