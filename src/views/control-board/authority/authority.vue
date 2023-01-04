<i18n src="./authority-lang.json"></i18n>
<template>
    <div class="control-authority">
        <div class="control-authority-head">
            <div>
                {{ $t('t1') }}
                <el-select
                    v-model="type"
                    size="mini"
                    @change="
                        () => {
                            this.roleListStore.getRoleList(this.currentUserName)
                            this.accountListStore.getUserList(this.currentUserName)
                        }
                    "
                >
                    <el-option value="account" :label="$t('t2')"></el-option>
                    <el-option value="role" :label="$t('t3')"></el-option>
                </el-select>
            </div>
            <div>
                <el-button size="mini" type="primary" plain @click="showAddDig">{{ $t('t4') }}</el-button>
                <el-button size="mini" type="warning" plain @click="startOrEndEdit('start')" v-if="!isEdit">{{ $t('t16') }}</el-button>
                <el-button size="mini" type="success" plain @click="startOrEndEdit('end')" v-else>{{ $t('t22') }}</el-button>
            </div>
        </div>
        <div class="authority-table">
            <div v-show="type === 'account'" style="height: 100%">
                <el-table ref="table" :data="userList" border style="height: 100%" height="100%" :row-key="rowKey">
                    <el-table-column prop="userName" :label="$t('t5')">
                        <template slot-scope="scope">
                            <span class="user-icon" :class="{ disabled: !scope.row.enable }">
                                <span class="user-name-text">{{ scope.row.userName }}</span></span
                            >
                        </template>
                    </el-table-column>
                    <el-table-column prop="desc" :label="$t('t7')">
                        <template slot-scope="scope">
                            <div>{{ scope.row.desc }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="graph" :label="$t('t9')" width="500">
                        <template slot="header">
                            <div class="authority-color">
                                <div>{{ $t('t9') }}</div>
                                <div>
                                    <span class="icon READ"></span>
                                    <span>READ</span>
                                </div>
                                <div>
                                    <span class="icon WRITE"></span>
                                    <span>WRITE</span>
                                </div>
                                <div>
                                    <span class="icon FULL"></span>
                                    <span>FULL</span>
                                </div>
                            </div>
                        </template>
                        <template slot-scope="scope">
                            <div v-if="scope.row.graphList" class="graph-list">
                                <div v-for="(item, index) in scope.row.graphList" :key="index">
                                    <div class="graph-item-box">
                                        <span class="icon" :class="item"></span>
                                        {{ index }}
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <div>{{ $t('t15') }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="about" :label="$t('t11')">
                        <template slot-scope="scope">
                            <div class="role-list">
                                <div v-for="item in scope.row.roles" :key="item" class="role-name-text">{{ item }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="isEdit" :label="$t('t12')" column-key="cba">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="showChangeUser(scope.row)">{{ $t('t16') }}</el-button>
                            <el-button
                                size="mini"
                                type="warning"
                                @click="enableOrDisableUser(scope.row, false)"
                                v-if="scope.row.userName !== currentUserName && scope.row.userName !== 'admin' && scope.row.enable === true"
                                >{{ $t('t23') }}</el-button
                            >
                            <el-button
                                size="mini"
                                type="success"
                                @click="enableOrDisableUser(scope.row, true)"
                                v-if="scope.row.userName !== currentUserName && scope.row.userName !== 'admin' && scope.row.enable === false"
                                >{{ $t('t24') }}</el-button
                            >
                            <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)" v-if="scope.row.userName !== currentUserName && scope.row.userName !== 'admin'">{{
                                $t('t17')
                            }}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="type === 'role'" style="height: 100%">
                <el-table ref="table" :data="roleList" border style="height: 100%" :row-key="rowKey">
                    <el-table-column prop="name" :label="$t('t6')">
                        <template slot-scope="scope">
                            <span class="user-icon" :class="{ disabled: !scope.row.enable }">
                                <span class="role-name-text">{{ scope.row.name }}</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" :label="$t('t8')"> </el-table-column>
                    <el-table-column prop="graph" :label="$t('t9')" width="500">
                        <template slot="header">
                            <div class="authority-color">
                                <div>{{ $t('t9') }}</div>
                                <div>
                                    <span class="icon NONE"></span>
                                    <span>NONE</span>
                                </div>
                                <div>
                                    <span class="icon READ"></span>
                                    <span>READ</span>
                                </div>
                                <div>
                                    <span class="icon WRITE"></span>
                                    <span>WRITE</span>
                                </div>
                                <div>
                                    <span class="icon FULL"></span>
                                    <span>FULL</span>
                                </div>
                            </div>
                        </template>
                        <template slot-scope="scope">
                            <div v-if="scope.row.permissions" class="graph-list">
                                <div v-for="(item, index) in scope.row.permissions" :key="index">
                                    <div class="graph-item-box">
                                        <span class="icon" :class="item"></span>
                                        {{ index }}
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <div>{{ $t('t15') }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="about" :label="$t('t10')">
                        <template slot-scope="scope">
                            <div class="role-list">
                                <div v-for="item in scope.row.users" :key="item" class="user-name-text">{{ item }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column column-key="abc" v-if="isEdit" :label="$t('t12')">
                        <template slot-scope="scope">
                            <div v-if="scope.row.name !== 'admin'">
                                <el-button size="mini" @click="showChangeRole(scope.row)">{{ $t('t16') }}</el-button>
                                <el-button size="mini" type="warning" @click="enableOrDisableRole(scope.row, false)" v-if="scope.row.enable === true">{{ $t('t23') }}</el-button>
                                <el-button size="mini" type="success" @click="enableOrDisableRole(scope.row, true)" v-if="scope.row.enable === false">{{ $t('t24') }}</el-button>
                                <el-button size="mini" type="danger" @click="deleteRole(scope.row)">{{ $t('t17') }}</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 添加用户 -->
        <div class="box" v-if="showUserDig">
            <div class="add-user-dig">
                <div class="add-user-dig-header">
                    <div>{{ $t('t18') }}</div>
                    <span class="el-icon-close" @click="cancelAddUser"></span>
                </div>
                <div class="add-user-dig-name">
                    <div class="add-user-dig-text">
                        {{ $t('t19') }}
                    </div>
                    <el-input autocomplete="off" v-model="addUserName" size="small"></el-input>
                </div>
                <div class="add-user-dig-name">
                    <div class="add-user-dig-text">
                        {{ $t('t7') }}
                    </div>
                    <el-input autocomplete="off" v-model="addUserDesc" size="small"></el-input>
                </div>
                <div class="add-user-dig-pwd">
                    <div class="add-user-dig-text">
                        {{ $t('t20') }}
                    </div>
                    <el-input autocomplete="off" v-model="addUserPWd" show-password size="small"></el-input>
                </div>
                <div class="add-user-dig-roles">
                    <div class="add-user-dig-text">
                        {{ $t('t11') }}
                    </div>
                    <el-select size="small" @focus="addUserRolesFocus" v-model="addUserRoles" multiple :placeholder="$t('t11')">
                        <el-option v-for="item in roleList" :key="item.name" :label="item.name" :value="item.name"> </el-option>
                    </el-select>
                </div>
                <div class="add-user-dig-btns">
                    <el-button @click="saveAddUser" class="c">{{ $t('t21') }}</el-button>
                    <el-button @click="cancelAddUser">{{ $t('t22') }}</el-button>
                </div>
            </div>
        </div>
        <!-- 修改用户 -->
        <div class="box" v-if="showChangeUsrDig">
            <div class="change-user-pwdorright">
                <div class="change-user-pwdorright-header">
                    {{ $t('t25') }}
                    <span class="el-icon-close" @click="cancelChangeUsrDig"></span>
                </div>
                <template v-if="this.currentUserName === this.changeUserName">
                    <div class="change-user-pwdorright-text">
                        {{ $t('t20') }}
                    </div>
                    <div>
                        <el-input autocomplete="off" size="small" v-model="oldPwd" show-password></el-input>
                    </div>
                </template>
                <div class="change-user-pwdorright-text">
                    {{ $t('t26') }}
                </div>
                <div>
                    <el-input autocomplete="off" auto-complete="off" size="small" v-model="changePwd" show-password></el-input>
                </div>
                <div class="change-user-pwdorright-text">
                    {{ $t('t7') }}
                </div>
                <el-input autocomplete="off" v-model="changeUserDesc" size="small"></el-input>
                <div class="change-user-pwdorright-text">
                    {{ $t('t11') }}
                </div>
                <el-select size="small" v-model="newRolesList" multiple :placeholder="$t('t11')">
                    <el-option v-for="item in roleList" :key="item.name" :label="item.name" :value="item.name"> </el-option>
                </el-select>

                <div class="change-user-pwdorright-btns">
                    <el-button @click="changeUser" type="primary">{{ $t('t21') }}</el-button>
                    <el-button @click="cancelChangeUsrDig">{{ $t('t22') }}</el-button>
                </div>
            </div>
        </div>
        <!-- 添加角色 -->
        <div class="box" v-if="showAddRoleDig">
            <div class="changeoradd-graph-dig">
                <div class="changeoradd-graph-dig-header">
                    {{ $t('t29') }}
                    <span class="el-icon-close" @click="closeAddGraphRightDig"></span>
                </div>
                <div class="changeoradd-graph-dig-text">
                    {{ $t('t31') }}
                </div>
                <el-input size="small" v-model="addRoleName"></el-input>
                <div class="changeoradd-graph-dig-text">
                    {{ $t('t8') }}
                </div>
                <el-input size="small" v-model="addRoleDesc"></el-input>
                <div class="changeoradd-graph-dig-text">
                    {{ $t('t9') }}
                </div>
                <div class="graph-right-table">
                    <el-table :data="addRoleGraphList" border style="width: 100%" :height="266">
                        <el-table-column prop="graphName" :label="$t('t27')" width="100"></el-table-column>
                        <el-table-column :label="$t('t28')">
                            <template slot-scope="scope">
                                <el-radio-group size="small" v-model="scope.row.graphRight">
                                    <el-radio class="N" label="NONE">NONE</el-radio>
                                    <el-radio class="R" label="READ">READ</el-radio>
                                    <el-radio class="W" label="WRITE">WRITE</el-radio>
                                    <el-radio class="F" label="FULL">FULL</el-radio>
                                </el-radio-group>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="changeoradd-graph-dig-btns">
                    <el-button type="primary" @click="saveAddGraphRight">{{ $t('t21') }}</el-button>
                    <el-button @click="closeAddGraphRightDig">{{ $t('t22') }}</el-button>
                </div>
            </div>
        </div>
        <!-- 修改角色 -->
        <div class="box" v-if="showChangeRoleDig">
            <div class="changeoradd-graph-dig">
                <div class="changeoradd-graph-dig-header">
                    {{ $t('t30') }}
                    <span class="el-icon-close" @click="closeChangeGraphRightDig"></span>
                </div>
                <div class="changeoradd-graph-dig-text">
                    {{ $t('t8') }}
                </div>
                <el-input size="small" v-model="changeRoleDesc"></el-input>
                <div class="changeoradd-graph-dig-text">
                    {{ $t('t9') }}
                </div>
                <div class="graph-right-table">
                    <el-table :data="changeRoleGraphList" border style="width: 100%" :height="266">
                        <el-table-column prop="graphName" :label="$t('t27')" width="100"></el-table-column>
                        <el-table-column :label="$t('t28')">
                            <template slot-scope="scope">
                                <el-radio-group size="small" v-model="scope.row.graphRight">
                                    <el-radio class="N" label="NONE">NONE</el-radio>
                                    <el-radio class="R" label="READ">READ</el-radio>
                                    <el-radio class="W" label="WRITE">WRITE</el-radio>
                                    <el-radio class="F" label="FULL">FULL</el-radio>
                                </el-radio-group>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="changeoradd-graph-dig-btns">
                    <el-button type="primary" @click="saveChangeGraphRight">{{ $t('t21') }}</el-button>
                    <el-button @click="closeChangeGraphRightDig">{{ $t('t22') }}</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { formatSeconds } from '@/core/uitls.ts'
import { getModule } from 'vuex-module-decorators'
import AccountListStore from '@/store/account-list/account-list'
import UserLoginStore from '@/store/user-login/user-login'
import RoleListStore from '@/store/role-list/role-list'
import SubGraphManageStore from '@/store/subgraph-manage/subgraph-manage'
@Component
export default class Authority extends Vue {
    public $refs!: {
        table: any
    }
    accountListStore: AccountListStore = getModule(AccountListStore, store)
    userLoginStore: UserLoginStore = getModule(UserLoginStore, store)
    subGraphManageStore: any = getModule(SubGraphManageStore, store)
    roleListStore: RoleListStore = getModule(RoleListStore, store)
    type: string = 'account'
    showUserDig: boolean = false
    addRoleDig: boolean = false
    addUserName: string = ''
    addUserPWd: string = ''
    addUserRoles: any[] = []
    addUserDesc: string = ''
    showChangeUsrDig: boolean = false
    desForKeys: any = {
        user: '账户名\xa0',
        password: '账户密码\xa0',
        newPassword: '密码\xa0'
    }
    changePwd: string = ''
    oldPwd: string = ''
    changeUserName: string = ''
    changeUserDesc: string = ''
    newRolesList: any[] = []
    isEdit: boolean = false
    showChangeRoleDig: boolean = false
    changeRoleName: string = ''
    changeRoleDesc: string = ''
    changeRoleGraphList: any[] = []

    showAddRoleDig: boolean = false
    addRoleName: string = ''
    addRoleDesc: string = ''
    addRoleGraphList: any[] = []
    get userList() {
        return JSON.parse(JSON.stringify(this.accountListStore.userList))
    }
    get roleList() {
        let data = JSON.parse(JSON.stringify(this.roleListStore.roleList))
        data.forEach((item) => {
            item.users = []
            let users = this.userList.filter((u) => u.roles.includes(item.name))
            users.forEach((u) => {
                item.users.push(u.userName)
            })
        })
        return data
    }
    get currentUserName() {
        return this.userLoginStore.userName
    }

    created() {
        this.accountListStore.getUserList(this.currentUserName)
        this.roleListStore.getRoleList(this.currentUserName)
    }
    async deleteUser(index, data) {
        if (data.userName === this.currentUserName) {
            this.$message({
                message: '不能删除自己的账户',
                type: 'warning'
            })
            return
        }
        this.$confirm(`此操作将永久删除${data.userName}账户, 是否继续?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(async () => {
                let result = await this.accountListStore.delUser(data.userName)

                if (result && result.status === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    if (data.userName === this.currentUserName) {
                        this.$router.push({ name: 'UserLogin' })
                        return
                    }
                    this.accountListStore.getUserList(this.currentUserName)
                }
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
    }
    async enableOrDisableUser(row, status) {
        let res = await this.accountListStore.enableOrDisableUser({
            roleName: row.userName,
            status: status
        })
        if (res.status === 200) {
            this.$message({
                message: status ? '启动用户成功' : '禁用用户成功',
                type: 'success'
            })
        } else {
            this.$message({
                message: res.data ? res.data.error_message : status ? '启动用户成功' : '禁用用户成功',
                type: 'error'
            })
        }
        this.accountListStore.getUserList(this.currentUserName)
    }
    async enableOrDisableRole(row, status) {
        let res = await this.roleListStore.enableOrDisableRole({
            roleName: row.name,
            status: status
        })
        if (res.status === 200) {
            this.$message({
                message: status ? '启动角色成功' : '禁用角色成功',
                type: 'success'
            })
        } else {
            this.$message({
                message: res.data ? res.data.error_message : status ? '启动角色失败' : '禁用角色失败',
                type: 'error'
            })
        }
        this.roleListStore.getRoleList(this.currentUserName)
    }
    cancelAddUser() {
        this.showUserDig = false
        this.addUserName = ''
        this.addUserPWd = ''
        this.addUserRoles = []
    }
    checkNull(data) {
        let keys = Object.keys(data)
        let nullKeyList = []
        keys.forEach((item) => {
            if (!data[item] && data[item] !== false) {
                nullKeyList.push(item)
            }
        })
        if (nullKeyList.length > 0) {
            let keysString = ''
            nullKeyList.forEach((key) => {
                // eslint-disable-next-line no-useless-escape
                keysString += this.desForKeys[key] || key
            })
            this.$message({
                message: keysString + ' 不能为空',
                type: 'error'
            })
            return true
        } else {
            return false
        }
    }
    showAddDig() {
        if (this.type === 'account') {
            this.showUserDig = true
        } else {
            this.showAddRoleDig = true
            this.showChangeUsrDig = false
            this.showChangeRoleDig = false
            this.showUserDig = false
            this.addRoleGraphList = []
            Object.keys(this.subGraphManageStore.subGraphList).forEach((item) => {
                this.addRoleGraphList.push({
                    graphName: item,
                    graphRight: 'NONE'
                })
            })
        }
    }
    addUserRolesFocus() {
        let addUserRoles = [this.addUserName]
        this.addUserRoles = addUserRoles
    }
    async saveAddUser() {
        var data = {
            user: this.addUserName,
            password: this.addUserPWd,
            description: this.addUserDesc,
            is_admin: false
        }
        let hasNull = this.checkNull(data)
        if (!hasNull) {
            let res = await this.accountListStore.addUser(data)
            if (res.status === 200) {
                if (this.addUserRoles.length > 1) {
                    let roles = []
                    this.addUserRoles.forEach((item) => {
                        if (item !== this.addUserName) {
                            return roles.push(item)
                        }
                    })
                    let params = {
                        name: this.addUserName,
                        roles: roles
                    }
                    let result = await this.accountListStore.saveUserList(params)
                }
                this.$message({
                    message: '添加账户成功',
                    type: 'success'
                })
                this.cancelAddUser()
                this.accountListStore.getUserList(this.currentUserName)
            } else {
                this.$message({
                    message: res.data ? res.data.error_message : '',
                    type: 'error'
                })
            }
        }
    }
    showChangeUser(row) {
        this.showChangeUsrDig = true
        this.showAddRoleDig = false
        this.showChangeRoleDig = false
        this.showUserDig = false
        this.changeUserName = row.userName
        this.changeUserDesc = row.desc
        this.newRolesList = [...row.roles]
        this.changePwd = ''
    }
    cancelChangeUsrDig() {
        this.showChangeUsrDig = false
        this.changePwd = ''
        this.newRolesList = []
        this.changeUserName = ''
        this.changeUserDesc = ''
    }
    async changeUser() {
        let r1: any = null
        let isAdmin = this.userList.find((item) => item.userName === this.changeUserName).roles.includes('admin')
        let params = {
            name: this.changeUserName,
            roles: this.newRolesList
        }
        let r2 = await this.accountListStore.saveUserList(params)
        let r3 = await this.accountListStore.changeUserDesc({ name: this.changeUserName, description: this.changeUserDesc })
        if (this.changePwd) {
            if (this.currentUserName !== this.changeUserName) {
                let obj = {
                    name: this.changeUserName,
                    isAdmin: isAdmin,
                    newPassword: this.changePwd
                }
                r1 = await this.accountListStore.changeUserPwd(obj)
            } else {
                r1 = await this.accountListStore.changeUserPwd({ name: this.changeUserName, oldPassword: this.oldPwd, newPassword: this.changePwd, isAdmin })
            }
        }
        if (r1) {
            if (r1 && r1.status === 200 && r2.status === 200) {
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
                this.changeUserName === this.currentUserName && this.$router.push({ name: 'UserLogin' })
            } else {
                this.$message({
                    message: r1.data.error_message || r1.error_message || '' + r2.data.error_message || r2.error_message || '',
                    type: 'warning'
                })
            }
        } else {
            if (r2.status === 200) {
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
            } else {
                this.$message({
                    message: r2.data.error_message || r2.error_message || '',
                    type: 'warning'
                })
            }
        }

        this.accountListStore.getUserList(this.currentUserName)
        this.cancelChangeUsrDig()
    }
    async deleteRole(row) {
        this.$confirm(`此操作将永久删除${row.name}角色, 是否继续?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(async () => {
                let result = await this.roleListStore.delRole(row.name)

                if (result && result.status === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    // if (row.userName === this.currentUserName) {
                    //     this.$router.push({ name: 'UserLogin' })
                    //     return
                    // }
                    this.roleListStore.getRoleList(this.currentUserName)
                } else {
                    this.$message({
                        type: 'error',
                        message: result.data.error_message
                    })
                }
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
    }
    rowKey(row) {
        return row.userName || row.name + '-' + this.type
    }
    showChangeRole(row) {
        this.showChangeRoleDig = true
        this.changeRoleName = row.name
        this.changeRoleDesc = row.description
        this.changeRoleGraphList = Object.keys(row.permissions).map((item) => {
            return { graphName: item, graphRight: row.permissions[item] }
        })
    }
    closeChangeGraphRightDig() {
        this.showChangeRoleDig = false
        this.changeRoleName = ''
        this.changeRoleDesc = ''
        this.changeRoleGraphList = []
    }

    async saveChangeGraphRight() {
        let permissions: any = {}
        this.changeRoleGraphList.forEach((item) => {
            permissions[item.graphName] = item.graphRight
        })
        await this.roleListStore.setRoleDescription({ roleName: this.changeRoleName, description: this.changeRoleDesc })
        let res = await this.roleListStore.setRolePermissions({ roleName: this.changeRoleName, data: permissions })
        if (res.status === 200) {
            this.$message({
                message: '修改权限成功',
                type: 'success'
            })
        } else {
            this.$message({
                message: res.data ? res.data.error_message : '修改权限失败',
                type: 'error'
            })
        }
        this.roleListStore.getRoleList(this.currentUserName)
        this.closeChangeGraphRightDig()
    }

    closeAddGraphRightDig() {
        this.showAddRoleDig = false
        this.showChangeUsrDig = false
        this.showChangeRoleDig = false
        this.showUserDig = false
        this.addRoleName = ''
        this.addRoleDesc = ''
        this.addRoleGraphList = []
    }
    async saveAddGraphRight() {
        let res = await this.roleListStore.addRole({ role: this.addRoleName, description: this.addRoleDesc })
        if (res.status === 200) {
            this.$message({
                message: '创建角色成功',
                type: 'success'
            })
        } else {
            this.$message({
                message: res.data ? res.data.error_message : '创建角色失败',
                type: 'error'
            })
        }
        let permissions: any = {}
        this.addRoleGraphList.forEach((item) => {
            permissions[item.graphName] = item.graphRight
        })
        await this.roleListStore.setRolePermissions({ roleName: this.addRoleName, data: permissions })
        this.roleListStore.getRoleList(this.currentUserName)
        this.closeAddGraphRightDig()
    }
    beforeUpdate() {
        this.$nextTick(() => {
            //在数据加载完，重新渲染表格
            this.$refs['table'].doLayout()
        })
    }
    startOrEndEdit(type) {
        if (type === 'start') {
            this.isEdit = true
        } else {
            this.isEdit = false
        }
    }
}
</script>
<style lang="less" scoped>
.control-authority {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: auto;
    .control-authority-head {
        height: 60px;
        display: flex;
        padding-left: 25px;
        padding-right: 20px;
        justify-content: space-between;
        align-items: center;
        background: #ffffff;
        box-shadow: 0 1px 0 0 #dedfdf;
        > div:first-child {
            font-family: OpenSans;
            font-size: 24px;
            color: #44527c;
            display: flex;
            align-items: center;
            .el-select {
                margin-left: 10px;
            }
        }
        .el-button {
            margin-left: 20px;
        }
    }
    .authority-table {
        height: calc(100% - 60px);
    }
    .graph-list {
        display: flex;
        flex-wrap: wrap;
        .graph-item-box {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 10px;
        }
    }
    .user-icon {
        padding-left: 40px;
        padding-left: 30px;
        background-repeat: no-repeat;
        background-size: 20px;
        background-position: 0px center;
        background-image: url('../../../assets/authority/User.png');
        &.disabled {
            background-image: url('../../../assets/authority/User-Disabled.png');
        }
    }
    .role-list {
        display: flex;
        flex-wrap: wrap;
    }
    .user-name-text {
        display: inline-block;
        margin-right: 10px;
        margin-bottom: 10px;
        border: 1px solid #dddddd;
        padding: 2px 5px;
        border-radius: 5px;
        background-color: #ebeef5;
        vertical-align: baseline;
    }
    .role-name-text {
        display: inline-block;
        margin-right: 10px;
        margin-bottom: 10px;
        border: 1px solid #777;
        padding: 2px 5px;
        border-radius: 5px;
        background-color: #777;
        vertical-align: baseline;
        color: #ffffff;
    }
    .READ {
        background: #e4e40e;
    }
    .WRITE {
        background: #46c120;
    }
    .FULL {
        background: #3e8cf6;
    }
    .NONE {
        background: #aaaaaa;
    }
    /deep/.N {
        .el-radio__input.is-checked {
            .el-radio__inner {
                background-color: #aaaaaa;
                border-color: #aaa;
            }
            & + .el-radio__label {
                color: #aaa;
            }
        }
    }
    /deep/.R {
        .el-radio__input.is-checked {
            .el-radio__inner {
                background-color: #e4e40e;
                border-color: #e4e40e;
            }
            & + .el-radio__label {
                color: #e4e40e;
            }
        }
    }
    /deep/.W {
        .el-radio__input.is-checked {
            .el-radio__inner {
                background-color: #3e8cf6;
                border-color: #3e8cf6;
            }
            & + .el-radio__label {
                color: #3e8cf6;
            }
        }
    }
    /deep/.F {
        .el-radio__input.is-checked {
            .el-radio__inner {
                background-color: #46c120;
                border-color: #46c120;
            }
            & + .el-radio__label {
                color: #46c120;
            }
        }
    }
    .icon {
        width: 11px;
        height: 6px;
        border-radius: 3px;
        margin-right: 5px;
        display: block;
    }
    .authority-color {
        display: flex;
        height: 23px;
        > div {
            height: 23px;
            display: flex;
            align-items: center;
            margin-right: 10px;
        }
    }
    .add-user-dig {
        width: 440px;
        height: 450px;
        overflow: hidden;
        background: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 4px;
        border-radius: 4px;
        padding: 0 16px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -390px;
        margin-top: -286px;
        &-header {
            font-family: PingFangSC-Regular;
            font-size: 20px;
            color: #44527c;
            height: 63px;
            line-height: 63px;
            border-bottom: 1px solid #e6e6e6;
            position: relative;
            .el-icon-close {
                position: absolute;
                right: 0;
                top: 20px;
                cursor: pointer;
            }
        }
        &-text {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #666666;
            height: 40px;
            line-height: 40px;
        }
        .el-input {
            input {
                height: 28px;
                line-height: 28px;
            }
            .el-input__icon {
                line-height: 28px;
            }
        }
        .el-select {
            width: 100%;
            input {
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #44527c;
            }
            .el-input__icon {
                line-height: 28px;
                font-size: 12px;
            }
        }
        &-btns {
            margin-top: 36px;
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;
            .el-button {
                width: 80px;
                height: 28px;
                line-height: 28px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                padding: 0;
            }
        }
    }
    .change-user-pwdorright {
        width: 440px;
        min-height: 300px;
        background: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 4px;
        border-radius: 4px;
        padding: 0 16px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -390px;
        margin-top: -110px;
        &-header {
            font-family: PingFangSC-Regular;
            font-size: 20px;
            color: #44527c;
            height: 63px;
            line-height: 63px;
            border-bottom: 1px solid #e6e6e6;
            position: relative;
            .el-icon-close {
                position: absolute;
                right: 0;
                top: 20px;
                cursor: pointer;
            }
        }
        &-text {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #666666;
            height: 40px;
            line-height: 40px;
        }
        .el-input {
            input {
                height: 28px;
                line-height: 28px;
            }
            .el-input__icon {
                line-height: 28px;
            }
        }
        .el-select {
            width: 100%;
        }
        .change-user-pwdorright-btns {
            margin-top: 36px;
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;
            .el-button {
                width: 80px;
                height: 28px;
                line-height: 28px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                padding: 0;
            }
        }
    }
    /deep/.changeoradd-graph-dig {
        background: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 4px;
        border-radius: 4px;
        width: 440px;
        min-height: 550px;
        padding: 0 16px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -390px;
        margin-top: -220px;
        &-header {
            font-family: PingFangSC-Regular;
            font-size: 20px;
            color: #44527c;
            height: 63px;
            line-height: 63px;
            border-bottom: 1px solid #e6e6e6;
            position: relative;
            .el-icon-close {
                position: absolute;
                right: 0;
                top: 20px;
                cursor: pointer;
            }
        }
        &-text {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #666666;
            height: 40px;
            line-height: 40px;
        }
        .el-table {
            background: #f5f7fa;
        }
        thead tr th {
            height: 28px;
            padding: 0;
            border-right: 0;
            text-align: center;
        }
        tbody {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #44527c;
            .cell {
                white-space: nowrap;
            }
            label {
                margin-right: 20px;
            }
            td {
                height: 24px;
                padding: 0;
                text-align: center;
            }
            .el-radio__label {
                font-size: 12px;
            }
            .el-radio__inner {
                width: 12px;
                height: 12px;
            }
        }
        &-btns {
            margin-top: 20px;
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;
            .el-button {
                width: 80px;
                height: 28px;
                line-height: 28px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                padding: 0;
            }
        }
    }
}
</style>
