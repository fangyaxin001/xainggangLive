<template>
<view :class="'stars ' + type">
  <image src="/static/images/icon/star-red.png" v-for="(item, index) in value" :data-val="index+1" @tap="changeVal"></image>
  <image src="/static/images/icon/star-empty.png" v-for="(item, index) in 5-value" :key="index" :data-val="value+index+1" @tap="changeVal"></image>
</view>
</template>

<script>

export default {
  data() {
    return {
		
	};
  },

  components: {},
  props: {
    value: Number,
    type: String,
    index: Number
  },
  
  computed:{
  	i18n() {
  		return this.$t('index')
  	}
  },
  
  methods: {
    changeVal(e) {
      if (this.type) {
        var value = e.currentTarget.dataset.val;
        this.$emit("onStarChange", {
          val: Number(value),
          idx: this.index
        });
      }
    }
  }
};
</script>
<style>
@import "./commStar.css";
</style>