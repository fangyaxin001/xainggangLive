<template>
  <view class="beat">
    <view class="wrap">
      <view class="music">
        <view class="li m1"></view>
        <view class="li m2"></view>
        <view class="li m3"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  
  computed:{
  	i18n() {
  		return this.$t('index')
  	}
  },
  
}
</script>

<style>
@import "./rhythmBeat.css";
</style>