<template>
  <div>
		<el-row class="container">
			<el-col :span="24" class="header">
				<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
					{{collapsed?'':sysName}}
				</el-col>			
				<el-col :span="4" class="userinfo">
					<el-dropdown trigger="hover">
						<span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
							<el-dropdown-item divided @click.native="changePassword">修改密码</el-dropdown-item>							
						</el-dropdown-menu>
					</el-dropdown>
				</el-col>
			</el-col>	
			<el-col :span="24" class="main">
				<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
					<!--导航菜单-->
					<el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
						unique-opened router v-show="!collapsed">					 
						<el-submenu :index="2" v-if="this.sysUserRole === 'admin'">
							<template slot="title"><i :class="$router.options.routes[2].iconCls"></i>{{$router.options.routes[2].name}}</template>
							<el-menu-item v-for="child in $router.options.routes[2].children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>	

						<el-submenu :index="3" v-if="this.sysUserRole === 'source'">
							<template slot="title"><i :class="$router.options.routes[3].iconCls"></i>{{$router.options.routes[3].name}}</template>
							<el-menu-item v-for="child in $router.options.routes[3].children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>				
					</el-menu>
				</aside>
				<section class="content-container">
					<div class="grid-content bg-purple-light">
						<el-col :span="24" class="breadcrumb-container">
							<strong class="title">{{$route.name}}</strong>
							<el-breadcrumb separator="/" class="breadcrumb-inner">
								<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
									{{ item.name }}
								</el-breadcrumb-item>
							</el-breadcrumb>
						</el-col>
						<el-col :span="24" class="content-wrapper">
							<transition name="fade" mode="out-in">
								<router-view></router-view>
							</transition>
						</el-col>
					</div>
				</section>
			</el-col>
		</el-row>
	<!--修改密码界面-->
		<el-dialog title="修改密码" v-model="changePasswordFormVisible" :close-on-click-modal="false">
			<el-form :model="newPassword" label-width="80px" :rules="changePasswordRules" ref="changePasswordForm">		
				<el-form-item label="新密码">
					<el-input v-model="newPassword"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="changePasswordFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="submitChangePassword" :loading="changePasswordLoading">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
  import { changePassword } from '../api/api'
  export default {
    data () {
      return {
        sysName: '任意花信息查询系统',
        collapsed: false,
        sysUserName: '',
        sysUserAvatar: '',
        sysUserRole: '',
        // change password form
        changePasswordFormVisible: false,
        changePasswordLoading: false,
        newPassword: '',
        changePasswordRules: {
          name: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      onSubmit () {
        console.log('submit!')
      },
      handleopen () {
      },
      handleclose () {

      },
      handleselect: function (a, b) {

      },
      // 退出登录
      logout: function () {
        var _this = this
        this.$confirm('确认退出吗?', '提示', {

        }).then(() => {
          sessionStorage.removeItem('user')
          _this.$router.push('/login')
        }).catch(() => {
        })
      },
      // 修改密码
      changePassword: function () {
        this.changePasswordFormVisible = true
      },
      submitChangePassword: function () {
        this.$refs.changePasswordForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认修改密码吗？', '提示', {}).then(() => {
              this.changePasswordLoading = true
              let para = {
                username: JSON.parse(sessionStorage.getItem('user')).username,
                password: this.newPassword
              }
              changePassword(para).then((res) => {
                this.changePasswordLoading = false
                this.$message({
                  message: '修改密码成功',
                  type: 'success'
                })
                this.$refs['changePasswordForm'].resetFields()
                this.changePasswordFormVisible = false
              })
            })
          }
        })
      },
      collapse: function () {
        this.collapsed !== this.collapsed
      },
      showMenu (i, status) {
        this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none'
      }
    },
    mounted () {
      var user = sessionStorage.getItem('user')
      if (user) {
        user = JSON.parse(user)
        console.log(user)
        this.sysUserName = user.username || ''
        this.sysUserAvatar = user.avatar || ''
        this.sysUserRole = user.role || ''
        console.log(this.sysUserRole)
      }
    }
  }
</script>

<style scoped lang="scss">
	@import '~scss_vars';
	
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:240px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
</style>