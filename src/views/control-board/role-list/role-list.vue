<i18n src="./role-list-lang.json"></i18n>
<template>
    <div class="role-manage">
        <div class="role-manage-head">
            <div>{{ $t('t1') }}</div>
            <a @click="popAddRoleDig">{{ $t('t2') }}</a>
        </div>
        <div class="role-manage-table">
            <el-table :data="roleList" border style="width: 100%">
                <el-table-column prop="name" :label="$t('t4')" width="152" align="left"> </el-table-column>
                <el-table-column prop="description" :label="$t('t3')" width="400">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.edit">
                            <div>
                                {{ scope.row.description }}
                                <span v-if="scope.row.name !== 'admin'" class="el-icon-edit pointer" @click="setRoleList(scope.row, true, scope)"></span>
                            </div>
                        </div>
                        <div v-else>
                            <div class="role-description-edit">
                                <el-input v-model="scope.row.description" size="small"></el-input>
                                <span class="el-icon-circle-check pointer" @click="saveRoleList(scope.row, scope)"></span>
                                <span class="el-icon-circle-close pointer" @click="setRoleList(scope.row, false, scope)"></span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="permissions" :label="$t('t5')">
                    <template slot-scope="scope">
                        <div class="role-permissions-list">
                            <div>
                                <div v-for="(value, index) in scope.row.permissions || {}" :key="index" class="graph-item">
                                    <span class="graph-name">{{ index }}</span> : <span class="graph-right">{{ value }}</span>
                                </div>
                            </div>
                            <div v-if="scope.row.name !== 'admin'">
                                <el-button size="mini" @click="changeGraphRight(scope.row)">{{ $t('t9') }}</el-button>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('t6')" width="230">
                    <template slot-scope="scope">
                        <span class="delete" v-if="scope.row.name !== 'admin'" @click="deleteRole(scope.row)" style="margin-right:20px;">
                            {{ $t('t16') }}
                        </span>
                        <el-switch v-if="scope.row.name !== 'admin'" v-model="scope.row.enable" active-text="已启用" inactive-text="已禁用" @change="enableOrDisableRole(scope)"> </el-switch>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="box" v-if="showChangeGraphRightDig">
            <div class="change-graph-dig">
                <div class="change-graph-dig-header">
                    {{ $t('t14') }}
                    <span class="el-icon-close" @click="closeChangeGraphRightDig"></span>
                </div>
                <div class="change-graph-dig-text">
                    {{ $t('t15') }}
                </div>
                <div class="graph-right-table">
                    <el-table :data="graphRightTable" border style="width: 100%" :height="266">
                        <el-table-column prop="graphName" :label="$t('t10')" width="100"></el-table-column>
                        <el-table-column :label="$t('t11')">
                            <template slot-scope="scope">
                                <el-radio-group size="small" v-model="scope.row.graphRight">
                                    <el-radio label="NONE">NONE</el-radio>
                                    <el-radio label="READ">READ</el-radio>
                                    <el-radio label="WRITE">WRITE</el-radio>
                                    <el-radio label="FULL">FULL</el-radio>
                                </el-radio-group>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="change-graph-dig-btns">
                    <el-button type="primary" @click="saveChangeGraphRight">{{ $t('t12') }}</el-button>
                    <el-button @click="closeChangeGraphRightDig">{{ $t('t13') }}</el-button>
                </div>
            </div>
        </div>
        <div class="box" v-if="showRoleDig">
            <div class="add-role-dig">
                <div class="add-role-dig-header">
                    <div>{{ $t('t2') }}</div>
                    <span class="el-icon-close" @click="cancelAddRole"></span>
                </div>
                <div class="add-role-dig-name">
                    <div class="add-role-dig-text">
                        {{ $t('t17') }}
                    </div>
                    <el-input v-model="addRoleName" size="small"></el-input>
                </div>
                <div class="add-role-dig-pwd">
                    <div class="add-role-dig-text">
                        {{ $t('t18') }}
                    </div>
                    <el-input v-model="addRoleDesc" size="small"></el-input>
                </div>

                <div class="add-role-dig-btns">
                    <el-button @click="saveAddUser">{{ $t('t12') }}</el-button>
                    <el-button @click="cancelAddRole">{{ $t('t13') }}</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import RoleListStore from '@/store/role-list/role-list'
import UserLoginStore from '@/store/user-login/user-login'
@Component({
    components: {}
})
export default class RoleList extends Vue {
    roleListStore: RoleListStore = getModule(RoleListStore, store)
    userLoginStore: UserLoginStore = getModule(UserLoginStore, store)
    showChangeGraphRightDig: boolean = false
    changeRoleName: string = ''
    showRoleDig: boolean = false
    addRoleName: string = ''
    addRoleDesc: string = ''
    created() {
        this.roleListStore.getRoleList(this.currentUserName)
    }
    get currentUserName() {
        return this.userLoginStore.userName
    }
    get roleList() {
        let data = JSON.parse(JSON.stringify(this.roleListStore.roleList))
        return data
    }
    get graphRightTable() {
        let target = this.roleList.find((item) => item.name === this.changeRoleName)
        if (target) {
            let data: any[] = []
            Object.keys(target.permissions).forEach((item) => {
                data.push({
                    graphName: item,
                    graphRight: target.permissions[item]
                })
            })
            return data
        }
        return []
    }
    async saveRoleList(row: any, scope: any) {
        let res = await this.roleListStore.setRoleDescription({ roleName: row.name, description: row.description })
        if (res.status === 200) {
            this.$message({
                message: '修改描述成功',
                type: 'success'
            })
        } else {
            this.$message({
                message: res.data ? res.data.error_message : '修改描述失败',
                type: 'error'
            })
        }
        this.setRoleList(row, false, null)
    }
    async saveAddUser() {
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
        this.roleListStore.getRoleList(this.currentUserName)
        this.cancelAddRole()
    }
    cancelAddRole() {
        this.addRoleName = ''
        this.addRoleDesc = ''
        this.showRoleDig = false
    }
    setRoleList(params, status, scope?: any) {
        params.edit = status
        if (!status && scope) {
            console.log(store)
            params.description = this.roleListStore.roleList[scope.$index].description
        }

        this.roleListStore.setRoleList(this.roleList)
    }
    popAddRoleDig() {
        this.showRoleDig = true
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
                    if (row.userName === this.currentUserName) {
                        this.$router.push({ name: 'UserLogin' })
                        return
                    }
                    this.roleListStore.getRoleList(this.currentUserName)
                }
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
    }
    changeGraphRight(row) {
        this.changeRoleName = row.name
        this.showChangeGraphRightDig = true
    }
    closeChangeGraphRightDig() {
        this.changeRoleName = ''
        this.showChangeGraphRightDig = false
    }
    async enableOrDisableRole(scope) {
        let row = scope.row
        let res = await this.roleListStore.enableOrDisableRole({
            roleName: row.name,
            status: row.enable
        })
        if (res.status === 200) {
            this.$message({
                message: scope.row.enable ? '启动角色成功' : '禁用角色成功',
                type: 'success'
            })
        } else {
            this.$message({
                message: res.data ? res.data.error_message : scope.row.enable ? '启动角色失败' : '禁用角色失败',
                type: 'error'
            })
        }
        this.roleListStore.getRoleList(this.currentUserName)
    }
    async saveChangeGraphRight() {
        let permissions: any = {}
        this.graphRightTable.forEach((item) => {
            permissions[item.graphName] = item.graphRight
        })
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
}
</script>
<style lang="less" scoped>
.role-manage {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: auto;
    .pointer {
        cursor: pointer;
        font-size: 20px;
        margin: 0 5px;
        &:hover {
            color: #3e8cf6;
        }
    }
    .READ {
        background: #dbdbdb;
    }
    .WRITE {
        background: #3e8cf6;
    }
    .FULL {
        background: #46c120;
    }
    .NONE {
        background: #aaaaaa;
    }
    .role-manage-head {
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
        }
        > a:last-child {
            background: #3e8cf6;
            border-radius: 4px;
            border-radius: 4px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #ffffff;
            width: 98px;
            height: 28px;
            line-height: 28px;
            text-align: center;
            cursor: pointer;
            &:hover {
                background: #70acff;
            }
            &:active {
                background: #2774de;
            }
        }
    }
    /deep/.role-manage-table {
        .el-table thead th {
            padding-top: 0;
            padding-bottom: 0;
            height: 32px;
            line-height: 32px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #666666;
            border-right: none;
            border-bottom-color: #e6e6e6;
            > div {
                border-right: 1px solid #e6e6e6;
                text-align: center;
            }
        }
        .el-table tbody td {
            padding-top: 10px;
            padding-bottom: 10px;
            border-right: none;
            border-bottom-color: #e6e6e6;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #44527c;
        }
        .el-table {
            .tbody-user-name {
                background-repeat: no-repeat;
                padding-left: 37px;
                text-align: left;
                line-height: 30px;
                &.admin {
                    background-image: url('../../../assets/user/admin.svg');
                }
                &.not-admin {
                    background-image: url('../../../assets/user/user.svg');
                }
            }
            .tbody-graph-list {
                display: flex;
                flex-wrap: wrap;
                padding: 10px 5px;
                align-content: stretch;
                align-items: center;
                color: #ffffff;
                .graph-item {
                    padding: 0px 20px;
                    border-radius: 10px;
                    margin-right: 10px;
                    margin-bottom: 5px;
                    margin-top: 5px;
                }
            }
        }
    }
    .box {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        z-index: 999;
        background: rgba(0, 0, 0, 0.3);
    }
    .role-description-edit {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .role-permissions-list {
        display: flex;
        align-items: center;
        > div:first-child {
            // flex-grow: 1;
            display: flex;
            flex-wrap: wrap;
        }
        .graph-name {
            font-weight: 700;
        }
    }
    .graph-item {
        margin-right: 15px;
    }
    /deep/.el-switch {
        span {
            font-size: 12px;
        }
    }
    /deep/.change-graph-dig {
        background: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 4px;
        border-radius: 4px;
        width: 440px;
        height: 440px;
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
    .delete {
        margin: 5px 30px 5px 0px;
        background-repeat: no-repeat;
        padding-left: 25px;
        height: 20px;
        line-height: 20px;
        cursor: pointer;
        background-image: url('../../../assets/user/delete.svg');
    }
    .add-role-dig {
        width: 440px;
        height: 300px;
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
