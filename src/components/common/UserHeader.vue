<template>
    <div class="header">
        <div class="del" @click="goStep()">
            <img src="@/assets/img/del.svg" alt="关闭">
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            goStep() {
                this.$router.go(-1);
            }
        }
    }
</script>

<style lang="less" scoped>
    .header {
        height: 44px;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex: 1;

        .del {
            width: 18px;
            height: 18px;
            margin-right: 32px;
        }
    }
</style>