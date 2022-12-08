<template>
    <div class="change-pwd" v-if="show">
        <div class="add-user-dig">
            <div class="add-user-dig-header">
                <div>修改密码</div>
                <span class="el-icon-close" @click="cancelAddUser"></span>
            </div>
            <div class="add-user-dig-name">
                <div class="add-user-dig-text">请输入原密码</div>
                <el-input v-model="oldPassword" size="small" show-password></el-input>
            </div>
            <div class="add-user-dig-pwd">
                <div class="add-user-dig-text">请输入新密码</div>
                <el-input v-model="newPassword" size="small" show-password></el-input>
            </div>
            <div class="add-user-dig-pwd">
                <div class="add-user-dig-text">再次输入新密码</div>
                <el-input v-model="newPassword2" size="small" show-password></el-input>
            </div>
            <div class="add-user-dig-btns">
                <el-button @click="changePassword" class="changePassword">确定</el-button>
                <el-button @click="cancelAddUser">取消</el-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import UserLoginStore from '@/store/user-login/user-login'
import AccountListStore from '@/store/account-list/account-list'
@Component
export default class ChangePwd extends Vue {
    userLoginStore: UserLoginStore = getModule(UserLoginStore, store)
    accountListStore: AccountListStore = getModule(AccountListStore, store)
    @Prop(Boolean) show!: false
    oldPassword: string = ''
    newPassword: string = ''
    newPassword2: string = ''
    get userName() {
        return this.userLoginStore.userName
    }
    get isAdmin(): boolean {
        return this.userLoginStore.isAdmin
    }
    async changePassword() {
        // if (this.userPassword.toString() !== this.oldPassword.toString()) {
        //     this.$message({
        //         message: '原密码错误',
        //         type: 'error'
        //     })
        //     return
        // }
        if (this.newPassword !== this.newPassword2) {
            this.$message({
                message: '两次输入的密码不相同',
                type: 'error'
            })
            return
        }
        let res = await this.accountListStore.changeUserPwd({ name: this.userName, oldPassword: this.oldPassword, newPassword: this.newPassword, isAdmin: this.isAdmin })
        if (res.status === 200) {
            this.$message({
                message: '密码修改成功,即将跳转登录页面',
                type: 'success',
                onClose: () => {
                    this.$emit('update:show', false)
                    this.$router.push({ name: 'UserLogin' })
                }
            })
        }
    }
    cancelAddUser() {
        this.$emit('update:show', false)
    }
}
</script>
<style lang="less" scoped>
.change-pwd {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    background: rgba(0, 0, 0, 0.3);
    .add-user-dig {
        width: 440px;
        height: 400px;
        overflow: hidden;
        background: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 4px;
        border-radius: 4px;
        padding: 0 16px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -220px;
        margin-top: -188px;
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
