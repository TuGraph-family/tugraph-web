<i18n src="./introduction-lang.json"></i18n>
<template>
    <div class="main-text-data-introduction">
        <div class="firstTitle">{{ $t('t1') }}</div>
        <section>
            {{ $t('t2') }}
        </section>
        <section>
            <div class="secondTitle">
                {{ $t('t3') }}
            </div>
            <ul>
                <li>
                    {{ $t('t4') }}
                </li>
                <li>{{ $t('t5') }}</li>
                <li>{{ $t('t6') }}</li>
                <li>{{ $t('t7') }}</li>
                <li>{{ $t('t8') }}</li>
                <li>{{ $t('t10') }}</li>
                <li>{{ $t('t11') }}</li>
                <li>{{ $t('t12') }}</li>
                <li>{{ $t('t13') }}</li>
            </ul>
        </section>
        <section>
            <div class="secondTitle">
                {{ $t('t16') }}
            </div>
            <ul>
                <li>{{ $t('t17') }}</li>
                <li>{{ $t('t18') }}</li>
                <li>{{ $t('t19') }}</li>
                <li>{{ $t('t20') }}</li>
                <li>{{ $t('t21') }}</li>
            </ul>
        </section>
        <section style="margin-bottom:100px;">
            {{ $t('t24') }}
        </section>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { component } from 'vue/types/umd'

@Component
export default class Introduction extends Vue {}
</script>

<style lang="less" scope>
.main-text-data-introduction {
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
