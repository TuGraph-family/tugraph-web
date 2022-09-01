<template>
    <div class="create-label-help">
        <div class="help-title">建模</div>
        <!-- <div>
            <video src="../../assets/help/CreateLabel.mp4"></video>
        </div> -->
        <div class="help-text">
            在建模页面中，左侧蓝色部分表示点的模型，右侧绿色部分表示边的模型。一级子节点是模型的名称，二级子节点是模型的属性，三级子节点是这个属性的信息：是否可空，和他的数据类型。
        </div>
        <div class="help-text">右上角可以搜索模型的名称或者属性，页面中会用红色高亮显示。</div>
        <div class="help-text">创建顶点模型，点击添加，选择对应的数据类型，是否可空默认是否，设置主键，创建成功之后页面中就会显示出来。</div>
        <div class="help-text">创建边的模型，不需要设置主键，也可以不添加任何属性。</div>
        <div class="help-text">创建好模型之后，我们就可以导入数据了。</div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class CreateLabelHelp extends Vue {}
</script>
<style lang="less" scoped>
.loading {
}
</style>
