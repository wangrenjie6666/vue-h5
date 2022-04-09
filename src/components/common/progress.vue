<template>
  <div class="line-wrap">
    <div
      :style="[lineStyle,radiusStyle]"
      class="line"
      ref="line"
    >
      <div
        :style="[{backgroundColor: color, width: proWidth},radiusStyle]"
        class="progress"
      ></div>
    </div>
    <div 
      class="outer-dot" 
      :style="outerDotStyle"
      v-if="showDot"></div>
    <div 
      class="inner-dot" 
      :style="innerDotStyle"
      v-if="showDot"></div>
  </div>
</template>

<script>

export default {
  props: {
    cur: {
      type: [String, Number],
      default: 0
    },
    max: {
      type: [String, Number],
      default: 100
    },
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: Number,
      default: 10
    },
    color: {
      type: String,
      default: '#008ffe'
    },
    radius: {
      type: [String, Number],
      default: ''
    },
    showDot: {
      type: Boolean,
      default: false
    },
    outerDotWidth: {
      type: Number,
      default: NaN
    },
    innerDotWidth: {
      type: Number,
      default: NaN
    }
  },
  data () {
    return {
      proWidth: 0,
      progressWidth: 0,
      dotLeft: 0,
      remRatio: document.documentElement.clientWidth > 640 
      ? 640 / 375 
      : document.documentElement.clientWidth / 375
    };
  },
  computed: {
    lineStyle () {
      return {
        width: isNaN(this.width) ? this.width : this.setUnit(this.width),
        height: this.setUnit(this.height),
        backgroundColor: '#ddd'
      };
    },
    radiusStyle () {
      const radius = this.radius === ''
        ? this.setUnit(this.height / 2)
        : this.setUnit(this.radius);
      return {
        borderRadius: radius
      }
    },
    outerDotW () {
      return Number.isNaN(this.outerDotWidth)
        ? Math.round(this.height * 2.4)
        : this.outerDotWidth
    },
    innerDotW () {
      return Number.isNaN(this.innerDotWidth)
        ? Math.round(this.height * 1.6)
        : this.innerDotWidth
    },
    outerDotStyle () {
      return {
        backgroundColor: this.color,
        width: this.setUnit(this.outerDotW), 
        height: this.setUnit(this.outerDotW),
        left: this.dotLeft,
        top: this.setUnit((this.outerDotW - this.height) / -2),
        marginLeft: this.setUnit((this.outerDotW - this.innerDotW) / -2)
      }
    },
    innerDotStyle () {
      return {
        backgroundColor: this.color,
        width: this.setUnit(this.innerDotW),
        height: this.setUnit(this.innerDotW),
        left: this.dotLeft,
        top: this.setUnit((this.innerDotW - this.height) / -2)
      }
    }
  },
  watch: {
    cur () {
      this.setWidth();
    }
  },
  mounted () {
    this.setWidth();
    this.$nextTick(() => {
      this.progressWidth = this.width === '100%'
        ? this.$refs.line.clientWidth
        : this.width;
    });
  },
  methods: {
    setWidth () {
      setTimeout(() => {
        const cur = this.cur > this.max
          ? this.max
          : this.cur;
        this.proWidth = `${cur / this.max * this.progressWidth}px`;
        this.dotLeft = cur / this.max * this.progressWidth - this.innerDotW * this.remRatio < 0
          ? 0
          : `${Math.ceil(cur / this.max * this.progressWidth - this.innerDotW * this.remRatio)}px`;
      }, 0);
    },
    setUnit (val) {
      return `${Math.round(this.remRatio * val)}px`;
    }
  }
};
</script>

<style lang="scss" scoped>
  .line-wrap {
    position: relative;
    background-color: transparent;
    .line {
      overflow: hidden;
      position: relative;
      .progress {
        height: 100%;
        transition: 1s width;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  .outer-dot {
    position: absolute;
    border-radius: 50%;
    opacity: 0.5;
    left: 0;
    transition: 1s left;
  }
  .inner-dot {
    position: absolute;
    left: 0;
    border-radius: 50%;
    z-index: 10;
    transition: 1s left;
  }
}
</style>