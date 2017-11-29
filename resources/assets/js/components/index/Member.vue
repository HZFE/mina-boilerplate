<template>
    <div class="member">
        <div class="avatar">
            <img src="https://o90cnn3g2.qnssl.com/b1dc4ac092e111e6b5e9cda6452ed833.jpg" alt="" class="avatar">
        </div>
        <div class="member-detail">
            <section class="name">
                daryl
            </section>
            <section class="descr">
                可爱的蓝孩纸。
            </section>
        </div>
    </div>
</template>

<style scoped>

    .member {
        width: 35%;
        height: 100px;
        border: 1px solid #FFD574;
        border-radius: 2px;
        float: left;
        margin-left: 10px;
        margin-bottom: 10px;
    }
    .member:hover {
        border: 1px solid #8F480E;
        box-shadow: 2px 2px 0 1px #8F480E;
    }
    .avatar {
        width: 80px;
        height: 80px;
        margin-top: 5px;
        margin-left: 5px;
        border-radius: 100px;
        float: left;
    }
    .member-detail {
        float: left;
        color: #8F480E;
        margin-left: 20px;
        margin-top: 5px;
    }
    .name {
        position: relative;
        margin-left: 10px;
        font-size: 30px;
    }
    .descr {
        margin-top: 10px;
        margin-left: 10px;
        font-size: 15px;
        font-weight: 100;
    }
</style>