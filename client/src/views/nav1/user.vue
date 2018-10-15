<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item label="注册时间">
					<el-date-picker 
						type="date" 
						placeholder="选择日期" 
						v-model="filters.registertime"
						value-format="yyyy-MM-dd"
					></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUser">查询</el-button>
				</el-form-item>
				<div><a>总数：{{ total }}</a></div>
			</el-form>
		</el-col>

		<!--列表-->
		<template>
			<el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="username" label="渠道名称" width="300" sortable>
				</el-table-column>
				<el-table-column prop="registertime" label="注册时间" width="300" sortable>
				</el-table-column>
				<el-table-column prop="phonenumber" label="电话" width="300" :formatter="formatphonenumber" sortable>
				</el-table-column>
			</el-table>
		</template>

		<!--Paging-->
		<el-col :span="24" class="toolbar">			
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>
<script>
import { getUserList } from '../../api/api'
export default {
  data () {
    return {
      filters: {
        registertime: ''
      },
      loading: false,
      users: [
      ],
      total: 0,
      page: 1
    }
  },
  methods: {
    getUser: function () {
      this.page = 1
      var logginuser = sessionStorage.getItem('user')
      console.log(logginuser)
      logginuser = JSON.parse(logginuser)
      let para = {
        registertime: this.filters.registertime,
        page: this.page,
        username: logginuser.username
      }
      console.log(para)
      this.loading = true
      getUserList(para).then((res) => {
        this.users = res.data.users
        this.total = res.data.total
        this.loading = false
      })
    },
    handleCurrentChange (val) {
      this.page = val
      var logginuser = sessionStorage.getItem('user')
      console.log(logginuser)
      logginuser = JSON.parse(logginuser)
      let para = {
        registertime: this.filters.registertime,
        page: this.page,
        username: logginuser.username
      }
      console.log(para)
      this.loading = true
      getUserList(para).then((res) => {
        this.users = res.data.users
        this.total = res.data.total
        this.loading = false
      })
    },
    formatphonenumber: function (row, column) {
      return row.phonenumber.substring(0, 3) + '****' + row.phonenumber.substring(-1, 4)
    }
  },
  mounted () {
    this.getUser()
  }
}
</script>

<style scoped>

</style>