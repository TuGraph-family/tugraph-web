<template>
    <div class="change-password-page">
        <ChangePwd :show="true"></ChangePwd>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import ChangePwd from '@/components/change-pwd/change-pwd.vue'
@Component({
    components: {
        ChangePwd
    }
})
export default class ChangePassword extends Vue {}
</script>
<style lang="less" scoped>
.change-password-page {
    width: 100%;
    height: 100%;
    position: relative;
}
</style>
