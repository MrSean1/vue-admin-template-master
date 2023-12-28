<template>
    <div class="app-container">
        <!-- 添加讲师页面 -->
        <el-form label-width="120px">
            <el-form-item label="讲师名称">
                <el-input v-model="teacher.name" />
            </el-form-item>
            <el-form-item label="讲师排序">
                <el-input-number v-model="teacher.sort" controls-position="right" min:="0" />
            </el-form-item>
            <el-form-item label="讲师头衔">
                <el-select v-model="teacher.level" clearable placeholder="请选择">
                    <!--
              数据类型一定要和取出的json中的一致，否则没法回填
              因此，这里value使用动态绑定的值，保证其数据类型是number
                -->
                    <el-option :value="1" label="高级讲师" />
                    <el-option :value="2" label="首席讲师" />
                </el-select>
            </el-form-item>
            <el-form-item label="讲师资历">
                <el-input v-model="teacher.career" />
            </el-form-item>
            <el-form-item label="讲师简介">
                <el-input v-model="teacher.intro" :rows="10" type="textarea" />
            </el-form-item>

            <!-- 讲师头像：TODO -->
            <el-form-item label="讲师头像">

                <!-- 头衔缩略图 -->
                <pan-thumb :image="teacher.avatar" />
                <!-- 文件上传按钮 -->
                <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow = true">更换头像
                </el-button>

                <image-cropper 
                    v-show="imagecropperShow" 
                        :width="300" 
                        :height="300" 
                        :key="imagecropperKey"
                        :url="BASE_API + '/eduoss/fileoss'" 
                        field="file" 
                        @close="close" 
                        @crop-upload-success="cropSuccess" />
            </el-form-item>

            <el-form-item>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
    components: {ImageCropper, PanThumb},

    data() {
        return {
            teacher: {
                name: '',
                sort: 0,
                level: 1,
                career: '',
                intro: '',
                avatar: ''  // 存储图片地址的

            },
            // 上传弹框是否显示
            imagecropperShow: false,
            imagecropperKey:0, // 上传组建key的值即唯一标识。
            BASE_API: process.env.BASE_API, // 获取dev.env.js里面的ip和端口号
            saveBtnDisabled: false // 按钮是否可用， 防止重复提交
        }
    },
    created() { 
        this.init()
        
    },
    watch: {
        $route(to, from){
            console.log('watch $route')
            this.init()
        }
    },
    methods: {
        close(){ // 关闭上传弹框的方法
            this.imagecropperShow = false,
            // 每次关闭弹框之后将上传组件进行重新出实话
            this.imagecropperKey = this.imagecropperKey +1
        },
        cropSuccess(data){ // 上传成功的方法
            // 点击上传后无论是否成功现将弹框关掉
            this.imagecropperShow = false,
            // 每次关闭弹框之后将上传组件进行重新出实话
            this.imagecropperKey = this.imagecropperKey +1
            // 上传之后接口返回图片地址
            this.teacher.avatar = data.url
        },
        init(){
            
        // 判断路径中是否有参数，且参数中是否有id值
        if (this.$route.params && this.$route.params.id) {
            // 获取路径中的id值
            const id = this.$route.params.id
            // console.log(id)
            // 根据id值调用 通过id获取讲师信息填充页面
            this.getInfo(id)
        } else {
            this.teacher = {
                sort: 0,
                level: 1,
            }
        }

        },

        // 根据讲师id查询讲师信息并添加到页面表单中
        getInfo(id){
            teacherApi.getTeacherById(id)
                .then(respose =>{
                    this.teacher = respose.data.items
                })
        },


        saveOrUpdate() {
            // 判断是修改还是添加 一句teacher对象中是否有id值来判断
            if (this.teacher.id) {
                this.updateTeacher()
            } else {
                this.saveTeacher()
            }

            
        },

        // 修改讲师信息
        updateTeacher(){
            teacherApi.updateTeacherInfo(this.teacher)
                .then(respose => {
                    // 提示信息
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    // 返回列表页面  路由跳转
                    this.$router.push({path:'/teacher/table'})
                })
        },


        // 添加讲师信息
        saveTeacher() {
            teacherApi.addTeacher(this.teacher)
                .then(respose => {
                    // 提示信息
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    });
                    // 返回列表页面  路由跳转
                    this.$router.push({path:'/teacher/table'})

                })
        }

    }
}
</script>