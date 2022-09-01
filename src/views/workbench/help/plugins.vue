<i18n src="./plugin-lang.json"></i18n>
<template>
    <div class="main-text-plugin">
        <div class="firstTitle">
            {{ $t('t1') }}
        </div>
        <!-- <video src="@/assets/help/Plugin.mp4" preload controls="controls"></video> -->
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
        <div class="lastSection" style="margin-top:20px">
            {{ $t('t6') }}
            <span style="font-size:12px"></span> :
            <a style="margin-right:20px;" download="khop.cpp" :href="baseUrl + 'plugin/khop.cpp'">khop.cpp</a>
            <a download="scan_edges.py" :href="baseUrl + 'plugin/scan_edges.py'">scan_edges.py</a>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { component } from 'vue/types/umd'
const baseUrl: string = process.env.BASE_URL
@Component
export default class Plugins extends Vue {
    baseUrl: string = baseUrl
}
</script>

<style lang="less" scope>
.main-text-plugin {
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
