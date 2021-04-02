<template>
    <view class="promo-con">
        <view class="suspension-btn" @tap="hanldeScorllTop">
            <image src="/static/images/login/goTop.png"></image>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {}
	},
    methods: {
        hanldeScorllTop () {
            uni.pageScrollTo({
                duration: 100,
                scrollTop: 0
            })
        }
    }
}
</script>

<style>
@import "./backTopBtn.css";
</style>
