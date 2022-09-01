<i18n src="./graph-base-lang.json"></i18n>
<template>
    <div class="mainText">
        <div class="firstTitle">{{ $t('t16') }}</div>
        <section>
            {{ $t('t1') }}
        </section>
        <img src="@/assets/help/movie_schema.png" alt="drawing" width="540" />
        <section>
            {{ $t('t2') }}
        </section>
        <ul>
            <li>
                {{ $t('t3') }}
            </li>
            <li>{{ $t('t4') }}</li>
            <li>{{ $t('t5') }}</li>
            <li>
                {{ $t('t6') }}
            </li>
            <li>{{ $t('t7') }}</li>
            <li>{{ $t('t8') }}</li>
            <li>{{ $t('t9') }}</li>
            <li>{{ $t('t10') }}</li>
            <li>{{ $t('t11') }}</li>
            <li>{{ $t('t12') }}</li>
            <li>
                {{ $t('t13') }}
            </li>
            <li>{{ $t('t14') }}</li>
            <li style="margin-bottom:40px;">
                {{ $t('t15') }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { component } from 'vue/types/umd'

@Component
export default class GraphBase extends Vue {}
</script>

<style lang="less" scope>
.mainText {
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
}
</style>
