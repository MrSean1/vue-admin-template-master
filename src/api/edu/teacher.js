import request from '@/utils/request'


export default {
    // 获取讲师列表
    // current 当前页
    // limit 每页记录数
    // teacherQuery 查询条件
    getTeacherListPage(curent, limit, teacherQuery) {
        return request({
            url: `/eduservice/teacher/pageTeacherCondition/${curent}/${limit}`,
            method: 'post',
            // params
            // teacherQuery 查询条件的对象   后端使用的是RequestBody获取数据
            // data表是将对象转换成json进行数据传递
            data: teacherQuery
        })
    },

    // 通过id删除讲师
    deleteTeacherById(id) {
        return request({
            url: `/eduservice/teacher/${id}`,
            method: `delete`
        })
    },

    // 添加讲师
    addTeacher(teacher) {
        return request({
            url: `/eduservice/teacher/addTeacher`,
            method: `post`,
            data: teacher
        })
    },

    // 通过id查询teacher信息
    getTeacherById(id) {
        return request({
            url: `/eduservice/teacher/getTeacher/${id}`,
            method: `get`
        })
    },

    // 通过id修改teacher信息
    updateTeacherInfo(teacher) {
        return request({
            url: `/eduservice/teacher/updateTeacher`,
            method: `post`,
            data: teacher
        })
    }
}

