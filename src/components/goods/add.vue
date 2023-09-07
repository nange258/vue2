<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="color: #fff;">
            <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item> 商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <!-- 提升区域 -->
            <el-alert title="添加商品信息" type="info" show-icon center :closable="false">
            </el-alert>
            <!-- 进度条 -->
            <el-steps :active="activeIndex - 0" align-center finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <el-form :model="addForm" :rules="addRulesForm" ref="addRuleForm" label-position="top">
                <!-- 左侧tab切换 -->
                <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTab" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_number">
                            <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProps"
                                @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="(item, i) in manyTableDate" :key="item.attr_id">
                            <!-- 复选框 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="ite" v-for="(ite, ind) in item.attr_vals" :key="ind"
                                    border></el-checkbox>
                            </el-checkbox-group></el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="(item, i) in onlyTableDate" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!--action上传图片地址  -->
                        <el-upload action="http://www.chenfuguo.cn:8899/api/private/v1/upload" :on-preview="handlePreview"
                            :on-remove="handleRemove" list-type="picture" :headers="headersObj"
                            :on-success="handeOnSuccess">
                            <el-button size="small" type="primary">点击上传</el-button> </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!--富文本编辑器 -->
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <!-- 添加商品的按钮 -->
                        <el-button type="primary" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览对话框 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" alt="">
        </el-dialog>
    </div>
</template>

<script>
// import _ from 'lodash'
import _ from 'lodash'

export default {
    props: {

    },
    data() {
        return {
            // tabe切换页面
            activeIndex: '0',
            // 添加商品的表单   
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                goods_cat: [],
                pics: [],
                goods_introduce: '',
                attrs: [],
            },
            // 验证规则
            addRulesForm: {
                goods_name: [
                    {
                        required: true, message: '请输入商品名称', trigger: 'blur'
                    },
                ],
                goods_price: [
                    {
                        required: true, message: '请输入商品价格', trigger: 'blur'
                    },
                ],
                goods_weight: [
                    {
                        required: true, message: '请输入商品重量', trigger: 'blur'
                    },
                ],
                goods_number: [
                    {
                        required: true, message: '请输入商品数量', trigger: 'blur'
                    },
                ],
                goods_cat: [
                    {
                        required: true, message: '请选择商品分类', trigger: 'blur'
                    },
                ],

            },
            // 所有商品分类数据
            cateList: [],
            // 
            cateProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children',
                expandTrigger: 'hover',
            },
            // 动态参数列表数据
            manyTableDate: [],
            onlyTableDate: [],
            // 请求头
            headersObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            // 预览图片路径
            previewPath: '',
            // 预览图片对话框显示隐藏
            previewVisible: false,

        };
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取所有商品定义
        async getCateList() {
            let { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) {
                uese.mg_state = !uese.mg_state
                return this.$message.error('获取商品分类数据失败')
            }
            this.cateList = res.data
            // console.log(this.cateList);
        },
        // 选择器变化触发的函数
        handleChange() {
            if (this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat = []
            }
        },
        // 
        beforeTab(newName, oldName) {
            if (this.addForm.goods_cat.length !== 3) {
                this.$message.error('请先选择商品分类！')
                return false
            }
        },
        // 点击tab切换的时候触发    
        async tabClicked() {
            // console.log(this.activeIndex);
            // 动态属性
            if (this.activeIndex === '1') {

                let { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, {
                    params: { sel: 'many' }
                })

                if (res.meta.status !== 200) {
                    uese.mg_state = !uese.mg_state
                    return this.$message.error('获取动态参数列表失败')
                }
                // console.log(res);
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.length == 0 ? '' : item.attr_vals.split(' ');
                });
                this.manyTableDate = res.data
                // console.log(this.manyTableDate[0].attr_vals);
            } else if (this.activeIndex === '2') {
                if (this.activeIndex === '2') {
                    let { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, {
                        params: { sel: 'only' }
                    })

                    if (res.meta.status !== 200) {
                        uese.mg_state = !uese.mg_state
                        return this.$message.error('获取静态属性列表失败')
                    }
                    this.onlyTableDate = res.data
                }
            }
        },
        // 图片预览效果
        handlePreview(file) {
            // console.log(file);
            this.previewPath = file.url
            // console.log(this.previewPath);
            this.previewVisible = true
        },
        // 点击删除图片时触发
        handleRemove(file) {
            let fil = file.response.data.tmp_path

            let i = this.addForm.pics.findIndex(x => { x.pic == fil })
            this.addForm.pics.splice(i, 1)
            // console.log(this.addForm.pics);  
        },
        // 图片上传成功后触发
        handeOnSuccess(response) {
            // console.log(response);
            let pic = { pic: response.data.tmp_path }
            this.addForm.pics.push(pic)
        },
        // 点击添加商品
        add() {
            this.$refs.addRuleForm.validate(async v => {
                if (!v) {
                    return this.$message.error('请填写必要的表单项')
                }
                // 执行添加
                let fro = _.cloneDeep(this.addForm)
                fro.goods_cat = fro.goods_cat.join(',')
                // 动态参数
                this.manyTableDate.forEach(item => {
                    // console.log(item.attr_vals);
                    let info = { attr_id: item.attr_id, attr_value: item.attr_vals }
                    this.addForm.attrs.push(info)
                })
                // 静态属性 
                this.onlyTableDate.forEach(item => {
                    let info = { attr_id: item.attr_id, attr_value: item.attr_vals }
                    this.addForm.attrs.push(info)
                })
                fro.attrs = this.addForm.attrs
                // console.log(fro);
                // 发起请求
                let { data: res } = await this.$http.post('goods', fro)
                // console.log(res);
                if (res.meta.status !== 201) {
                    // uese.mg_state = !uese.mg_state
                    return this.$message.error('添加失败')
                }
                this.$message.success('添加成功')
                this.$router.push('/home/goods')

            })
        },
    },

}
</script>

<style scoped lang="less">
.el-card {
    margin-top: 20px;
    // background-color: ;
}

.el-steps {
    margin: 20px 0;
}

.is-wait {
    // 我的
    font-size: 14px !important;
}

.el-form {
    text-align: left;
}

.el-checkbox {
    margin: 5px;
}

.quill-editor {
    margin-bottom: 20px;
}
</style>
