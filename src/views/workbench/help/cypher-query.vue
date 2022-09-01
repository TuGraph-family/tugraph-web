<i18n src="./cypher-query-lang.json"></i18n>
<template>
    <div class="main-text-cypher-query">
        <div class="firstTitle">{{ $t('t1') }}</div>
        <!-- <video src="@/assets/help/CypherIntro.mp4" preload controls="controls"></video> -->
        <section>
            {{ $t('t2') }}
            <div class="cypher-item" :class="doClick && 'do-click'" @click="clickCypher(`MATCH (n:person{name:'Hugo Weaving'}) RETURN n`)" style="margin-bottom:0px;">
                <span class="cm-keyword">MATCH</span> (<span class="cm-atom">n:person</span>{<span class="cm-atom">name:</span><span class="cm-string">'Hugo Weaving'</span>})
                <span class="cm-keyword">RETURN</span>
                n
            </div>
            {{ $t('t3') }}
        </section>
        <section>
            {{ $t('t4') }}
        </section>
        <section>
            {{ $t('t5') }}
        </section>
        <section>
            {{ $t('t6') }}
        </section>
        <section>
            {{ $t('t7') }}
        </section>
        <section>
            {{ $t('t8') }}
        </section>
        <section style="margin-bottom:40px;">
            {{ $t('t9') }}
        </section>
        <section>
            <section>{{ $t('t10') }}：</section>
            <section>
                <div>
                    {{ $t('t11') }}
                </div>
                <div class="cypher-item" :class="doClick && 'do-click'" @click="clickCypher(`MATCH (m:movie {title:'Forrest Gump'})<-[:acted_in]-(a:person) RETURN a, m`)">
                    <span class="cm-keyword">MATCH</span> (<span class="cm-atom">m:movie</span> {<span class="cm-atom">title:</span>
                    <span class="cm-string">'Forrest Gump'</span>})&lt;-[:acted_in]-(<span class="cm-atom">a:person</span>) <span class="cm-keyword">RETURN</span> a, m
                </div>
            </section>
            <section>
                <div>
                    {{ $t('t12') }}
                </div>
                <div class="cypher-item" :class="doClick && 'do-click'" @click="clickCypher(`MATCH (m:movie {title: 'Forrest Gump'})<-[r:acted_in]-(a:person) RETURN a.name,r.role`)">
                    <span class="cm-keyword">MATCH</span> (<span class="cm-atom">m:movie</span> {<span class="cm-atom">title:</span> <span class="cm-string">'Forrest Gump'</span>})&lt;-[<span
                        class="cm-atom"
                        >r:acted_in</span
                    >]-(<span class="cm-atom">a:person</span>)
                    <span class="cm-keyword">RETURN</span>
                    a.name,r.role
                </div>
            </section>
            <section>
                <div>{{ $t('t13') }}</div>
                <div class="cypher-item" :class="doClick && 'do-click'" @click="clickCypher(`MATCH (u:user {login: 'Michael'})-[r:rate]->(m:movie) WHERE r.stars < 3 RETURN m.title, r.stars`)">
                    <span class="cm-keyword">MATCH</span> (<span class="cm-atom">u:user</span> {<span class="cm-atom">login:</span> <span class="cm-string">'Michael'</span>})-[<span class="cm-atom"
                        >r:rate]</span
                    >->(<span class="cm-atom">m:movie</span>) <span class="cm-keyword">WHERE</span> r.stars &lt; 3 <span class="cm-keyword">RETURN</span> m.title, r.stars
                </div>
            </section>
            <section>
                <div>
                    {{ $t('t14') }}
                </div>
                <div
                    class="cypher-item"
                    :class="doClick && 'do-click'"
                    @click="clickCypher(`MATCH (u:user {login: 'Michael'})-[r:rate]->(m:movie)<-[s:rate]-(v) WHERE r.stars < 3 AND s.stars < 3 RETURN u, m, v`)"
                >
                    <span class="cm-keyword">MATCH</span> (<span class="cm-atom">u:user</span> {<span class="cm-atom">login:</span> <span class="cm-string">'Michael'</span>})-[<span class="cm-atom"
                        >r:rate</span
                    >]->(<span class="cm-atom">m:movie</span>)&lt;-[s:rate]-(v) <span class="cm-keyword">WHERE</span> r.stars &lt; 3 <span class="cm-def">AND</span> s.stars &lt; 3
                    <span class="cm-keyword">RETURN</span> u, m, v
                </div>
            </section>
            <section>
                <div>
                    {{ $t('t15') }}
                </div>
                <div
                    class="cypher-item"
                    :class="doClick && 'do-click'"
                    @click="
                        clickCypher(`MATCH (u:user {login: 'Michael'})-[r:rate]->(m:movie)<-[s:rate]-(v)-[r2:rate]->(m2:movie) WHERE r.stars < 3 AND s.stars < 3 AND r2.stars > 3 RETURN u, m, v, m2`)
                    "
                >
                    <span class="cm-keyword">MATCH</span> (<span class="cm-atom">u:user</span> {<span class="cm-atom">login:</span> <span class="cm-string">'Michael'</span>})-[<span class="cm-atom"
                        >r:rate</span
                    >]->(<span class="cm-atom">m:movie</span>)&lt;-[<span class="cm-atom">s:rate</span>]-(v)-[<span class="cm-atom">r2:rate</span>]->(<span class="cm-atom">m2:movie</span>)
                    <span class="cm-keyword">WHERE</span> r.stars &lt; 3 <span class="cm-def">AND</span> s.stars &lt; 3 <span class="cm-def">AND</span> r2.stars > 3
                    <span class="cm-keyword">RETURN</span> u, m, v, m2
                </div>
            </section>
            <section>
                <div>
                    {{ $t('t16') }}
                </div>
                <div
                    class="cypher-item"
                    :class="doClick && 'do-click'"
                    @click="clickCypher(`MATCH (u:user {login: 'Michael'})-[:is_friend]->(v:user)-[r:rate]->(m:movie) WHERE r.stars > 3 RETURN u, v, m`)"
                >
                    <span class="cm-keyword">MATCH</span> (<span class="cm-atom">u:user</span> {<span class="cm-atom">login:</span> <span class="cm-string">'Michael'</span>})-[:is_friend]->(<span
                        class="cm-atom"
                        >v:user</span
                    >)-[<span class="cm-atom">r:rate</span>]->(<span class="cm-atom">m:movie</span>) <span class="cm-keyword">WHERE</span> r.stars > 3 <span class="cm-keyword">RETURN</span> u, v, m
                </div>
            </section>
            <section style="margin-bottom: 40px;">
                <div>
                    {{ $t('t17') }}
                </div>
                <div
                    class="cypher-item"
                    :class="doClick && 'do-click'"
                    @click="clickCypher(`MATCH (m:movie {title:'Forrest Gump'})<-[r:rate]-(u:user)-[r2:rate]->(m2:movie) WHERE r.stars>3 AND r2.stars>3 RETURN m, u,m2`)"
                >
                    <span class="cm-keyword">MATCH</span> (<span class="cm-atom">m:movie</span> {<span class="cm-atom">title:</span><span class="cm-string">'Forrest Gump'</span>})&lt;-[<span
                        class="cm-atom"
                        >r:rate</span
                    >]-(<span class="cm-atom">u:user</span>)-[<span class="cm-atom">r2:rate</span>]->(<span class="cm-atom">m2:movie</span>) <span class="cm-keyword">WHERE</span> r.stars>3
                    <span class="cm-def">AND</span> r2.stars>3 <span class="cm-keyword">RETURN</span> m, u,m2
                </div>
            </section>
        </section>
        <div class="secondTitle">{{ $t('t18') }}</div>
        <!-- <video src="@/assets/help/CypherEdit.mp4" preload controls="controls"></video> -->
        <section>
            {{ $t('t19') }}
        </section>
        <section>
            {{ $t('t20') }}
        </section>
        <section>
            {{ $t('t21') }}
        </section>
        <section>
            {{ $t('t22') }}
        </section>
        <section>
            {{ $t('t23') }}
        </section>
        <section class="lastSection">
            {{ $t('t24') }}
        </section>
        <section>
            {{ $t('t25') }}
        </section>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { component } from 'vue/types/umd'
import { getModule } from 'vuex-module-decorators'
import CypherStore from '@/store/cypher/cypher'
import 'codemirror/lib/codemirror.css'
@Component
export default class CypherQuery extends Vue {
    cypherStore: CypherStore = getModule(CypherStore, store)
    doClick: boolean = false
    created() {
        let componentName = this.$route.name
        if (componentName === 'Cypher') {
            this.doClick = true
        }
    }
    clickCypher(cypher: string) {
        this.cypherStore.upDateCurrentCypher(cypher)
        this.$emit('update:show', false)
    }
}
</script>

<style lang="less" scope>
.main-text-cypher-query {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #052c57;
    line-height: 28px;
    // overflow: auto;
    // position: absolute;
    // width: calc(100% - 30px);
    // height: 100%;
    video {
        width: 100%;
    }
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
    .cypher-item {
        width: 440px;
        min-height: 40px;
        background: #f3f4f8;
        padding: 12px 12px;
        margin-bottom: 22px;
        line-height: 20px;
        border-radius: 4px;
        border-radius: 4px;
        box-sizing: border-box;
        border: 1px solid transparent;
        font-size: 12px;
        &.do-click {
            cursor: pointer;
        }
    }
    .cm-keyword {
        color: #708;
    }
    .cm-atom {
        color: #219;
    }
    .cm-string {
        color: #a11;
    }
    .cm-def {
        color: #00f;
    }
}
</style>
