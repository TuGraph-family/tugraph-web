<template>
    <div class="loading">
        <div class="loading-box">
            <div class="circle circle1">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="circle circle2">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="circle circle3">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import store from '@/store/index'
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component
export default class Loading extends Vue {}
</script>
<style lang="less" scoped>
.loading {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
    position: relative;
    .loading-box {
        width: 50px;
        height: 50px;
        position: relative;
        left: 50%;
        top: 50%;
        margin-left: -25px;
        margin-top: -25px;
    }
    .circle {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .circle span {
        width: 10px;
        height: 10px;
        display: inline-block;
        background: #323457;
        border-radius: 100%;
        position: absolute;
        -webkit-animation: mycircle 1.2s infinite ease-in-out;
        animation: mycircle 1.2s infinite ease-in-out;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
    }
    .circle2 {
        -webkit-transform: rotateZ(45deg);
        transform: rotateZ(45deg);
    }
    .circle3 {
        -webkit-transform: rotateZ(90deg);
        transform: rotateZ(90deg);
    }
    .circle > span:nth-child(1) {
        top: 0;
        left: 0;
    }
    .circle > span:nth-child(2) {
        top: 0;
        right: 0;
    }
    .circle > span:nth-child(3) {
        right: 0;
        bottom: 0;
    }
    .circle > span:nth-child(4) {
        left: 0;
        bottom: 0;
    }
    .circle2 > span:nth-child(1) {
        -webkit-animation-delay: -1.1s;
        animation-delay: -1.1s;
    }
    .circle3 > span:nth-child(1) {
        -webkit-animation-delay: -1s;
        animation-delay: -1s;
    }
    .circle1 > span:nth-child(2) {
        -webkit-animation-delay: -0.9s;
        animation-delay: -0.9s;
    }
    .circle2 > span:nth-child(2) {
        -webkit-animation-delay: -0.8s;
        animation-delay: -0.8s;
    }
    .circle3 > span:nth-child(2) {
        -webkit-animation-delay: -0.7s;
        animation-delay: -0.7s;
    }
    .circle1 > span:nth-child(3) {
        -webkit-animation-delay: -0.6s;
        animation-delay: -0.6s;
    }
    .circle2 > span:nth-child(3) {
        -webkit-animation-delay: -0.7s;
        animation-delay: -0.7s;
    }
    .circle3 > span:nth-child(3) {
        -webkit-animation-delay: -0.4s;
        animation-delay: -0.4s;
    }
    .circle1 > span:nth-child(4) {
        -webkit-animation-delay: -0.3s;
        animation-delay: -0.3s;
    }
    .circle2 > span:nth-child(4) {
        -webkit-animation-delay: -0.2s;
        animation-delay: -0.2s;
    }
    .circle3 > span:nth-child(4) {
        -webkit-animation-delay: -0.1s;
        animation-delay: -0.1s;
    }
    @-webkit-keyframes mycircle {
        0% {
            transform: scale(0);
        }
        40% {
            transform: scale(1);
        }
        80% {
            transform: scale(0);
        }
        100% {
            transform: scale(0);
        }
    }
    @keyframes mycircle {
        0% {
            transform: scale(0);
        }
        40% {
            transform: scale(1);
        }
        80% {
            transform: scale(0);
        }
        100% {
            transform: scale(0);
        }
    }
}
</style>
