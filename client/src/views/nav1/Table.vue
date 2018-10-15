<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->		
		<el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column prop="username" label="渠道源名称" width="180" sortable>
			</el-table-column>
			<el-table-column prop="userstatus" label="渠道状态" width="160" :formatter="formatStatus" sortable>
			</el-table-column>
			<el-table-column prop="percentage" label="过滤比例" width="180" sortable>
			</el-table-column>
			<el-table-column prop="password" label="密码" width="160" sortable>
			</el-table-column>
			<el-table-column label="操作" width="170">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">			
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">				
				<el-form-item label="渠道状态">
					<el-radio-group v-model="editForm.userstatus">
						<el-radio class="radio" :label="1">启用</el-radio>
						<el-radio class="radio" :label="0">禁止</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="过滤比例">
					<el-input-number v-model="editForm.percentage" :min="0" :max="100"></el-input-number>
				</el-form-item>
				<el-form-item label="密码">
					<el-input v-model="editForm.password"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="渠道名称" prop="username">
					<el-input v-model="addForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="渠道状态">
					<el-radio-group v-model="addForm.userstatus">
						<el-radio class="radio" :label="1">启用</el-radio>
						<el-radio class="radio" :label="0">禁止</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="过滤比例">
					<el-input-number v-model="addForm.percentage" :min="0" :max="100"></el-input-number>
				</el-form-item>				
				<el-form-item label="密码">
					<el-input v-model="addForm.password"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import { getUserListPage, editUser, addUser } from '../../api/api'
export default {
  data () {
    return {
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      },
      // 编辑界面数据
      editForm: {
        userstatus: 1,
        percentage: 0,
        password: ''
      },
      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        username: [
          { required: true, message: '请输入渠道名称', trigger: 'blur' }
        ]
      },
      // 新增界面数据
      addForm: {
        username: '',
        userstatus: 1,
        percentage: 0,
        password: ''
      }
    }
  },
  methods: {
  // 状态显示转换
    formatStatus: function (row, column) {
      return row.userstatus === 1 ? '启用' : row.userstatus === 0 ? '禁止' : '未知'
    },
    handleCurrentChange (val) {
      this.page = val
      this.getUsers()
    },
    // 获取用户列表
    getUsers () {
      let para = {
        page: this.page
      }
      this.listLoading = true
      getUserListPage(para).then((res) => {
        this.total = res.data.total
        this.users = res.data.users
        this.listLoading = false
      })
    },
    // 显示编辑界面
    handleEdit: function (index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    // 显示新增界面
    handleAdd: function () {
      this.addFormVisible = true
      this.addForm = {
        username: '',
        userstatus: 1,
        percentage: 0,
        password: ''
      }
    },
    // 编辑
    editSubmit: function () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            let para = Object.assign({}, this.editForm)
            editUser(para).then((res) => {
              this.editLoading = false
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['editForm'].resetFields()
              this.editFormVisible = false
              this.getUsers()
            })
          })
        }
      })
    },
    // 新增
    addSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            let para = Object.assign({}, this.addForm)
            addUser(para).then((res) => {
              this.addLoading = false
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getUsers()
            })
          })
        }
      })
    }
  },
  mounted () {
    this.getUsers()
  }
}
</script>

<style scoped>

</style>