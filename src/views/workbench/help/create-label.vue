<i18n src="./create-label-lang.json"></i18n>
<template>
    <div class="main-text-create-label">
        <div class="firstTitle">{{ $t('t1') }}</div>
        <!-- <video src="@/assets/help/CreateLabel.mp4" preload controls="controls"></video> -->
        <section>
            {{ $t('t2') }}
        </section>
        <section>
            {{ $t('t3') }}
        </section>
        <section>
            {{ $t('t4') }}
        </section>
        <section>
            {{ $t('t5') }}
        </section>
        <section class="lastSection">
            {{ $t('t6') }}
        </section>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { component } from 'vue/types/umd'

@Component
export default class CreateLabel extends Vue {
    pluginLoading: boolean = false
    labelLoading: boolean = false
    dataLoading: boolean = false
    confirmCreateLabel() {}
    confirmCreateData() {}
    pluginCreateData() {}
}
</script>

<style lang="less" scope>
.main-text-create-label {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #052c57;
    line-height: 28px;
    .firstTitle {
        margin-top: 55px;
        margin-bottom: 40px;
        font-family: MicrosoftYaHei-Bold;
        font-size: 32px;
        color: #052c57;
    }
    .secondTitle {
        margin-bottom: 12px;
        font-family: MicrosoftYaHei-Bold;
        font-size: 18px;
        color: #052c57;
        line-height: 28px;
    }
    section {
        margin-bottom: 12px;
        li {
            font-family: MicrosoftYaHei;
            font-size: 14px;
            color: #052c57;
            line-height: 28px;
        }
    }
    video {
        width: 100%;
        margin-bottom: 20px;
    }
}
</style>
