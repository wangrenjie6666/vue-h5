<template>
	<div class="index-box">
		<div class="title" @click="handleTitle">
			<div>{{ bookType == 0 ? '信用卡账本' : '生活账本' }}</div>
			<van-image :width="10" :height="6" :src="downImg" style="margin-left: 5px"></van-image>
		</div>
		<div>
			<div class="f16" v-if="bookType == '0'"><Card :cardInfo="cardInfo"></Card></div>
			<div v-else-if="bookType == '1'"><Life></Life></div>
		</div>
		<van-popup v-model="typePopupShow" position="top" round :style="{ height: '200px' }">
			<div class="wrapper">
				<div class="overlay-div" @click.stop>
					<div class="title" @click="typePopupShow = false">
						<div>切换账本</div>
						<van-image :width="10" :height="6" :src="upImg" style="margin-left: 5px"></van-image>
					</div>
					<div class="overlay-bottom">
						<div
							class="overlay-for"
							v-for="(item, index) in bookTypeList"
							:key="index"
							:class="{ 'dialog-active': item.value == bookType }"
							@click="handleBookType(item)"
						>
							<van-image v-if="item.name == '信用卡账本'" :height="30" :width="45" :src="item.imgUrl"></van-image>
							<van-image v-else :height="30" :width="35" :src="item.imgUrl"></van-image>
							<div class="dialog-name">{{ item.name }}</div>
						</div>
					</div>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
import { loginOut, mergeVisitorData, deleteVisitorData } from '@/api/login';
import Card from '@/views/index/card/card.vue';
import Life from '@/views/index/life/life.vue';
import { changeAccount } from '@/api/center.js';
import { manageCardHome } from '@/api/index';
export default {
	components: {
		Card,
		Life
	},
	name: 'Index',
	data() {
		return {
			upImg: require('@/assets/icon/向上.png'),
			downImg: require('@/assets/icon/向下白.png'),
			bookType: null,
			islogin: localStorage.getItem('token'),
			typePopupShow: false,
			bookTypeList: [
				{
					value: 0,
					name: '信用卡账本',
					imgUrl: require('@/assets/img/信用卡账本.png')
				},
				{
					value: 1,
					name: '生活账本',
					imgUrl: require('@/assets/img/生活账本.png')
				}
			],
			cardInfo: {},
		};
	},
	created() {
		this.manageCardHome();
		console.log('created this.fromPath', this.fromPath);
		// if(this.fromPath == '/diagnosis'){
		//   location.reload()
		// }
		this.$store.commit('set_tabbarActive', this.$route.path);
		// console.log('this.fromPath',this.fromPath);
		// if(this.fromPath == '/login'){
	},
	mounted() {
		console.log('mounted this.fromPath', this.fromPath);
		let userinfo = this.$store.getters.get_userinfo();
		console.log('userinfo', userinfo);
		if (this.fromPath == '/login' && userinfo && userinfo.existVisitorData) {
			this.$vDialog
				.confirm({
					title: '提示',
					message: '是否合并游客数据?',
					confirmButtonText: '是',
					cancelButtonText: '否'
				})
				.then(() => {
					// on confirm
					let uniqueId = this.$store.getters.get_uniqueId();
					let data = {
						account: userinfo.phone,
						uniqueId,
						fromType: 2
					};
					mergeVisitorData(data).then(res => {
						userinfo.existVisitorData = false;
						this.$store.commit('set_userinfo', userinfo);
						this.$vtoast('合并成功');
						let nowBookType = this.$store.getters.get_bookType();
						if (this.bookType != nowBookType) {
							this.bookType = nowBookType;
						}
						if(this.bookType == 0){
							this.manageCardHome()
						}
						// if(userinfo.creditCardNum < 1 && !res.data ){ //如果没有信用卡就跳转添加信用卡页面
						//   this.$router.push({
						//     path: "/editCard",
						//   });
						// }
					});
				})
				.catch(() => {
					// on cancel
					let uniqueId = this.$store.getters.get_uniqueId();
					let data = {
						account: userinfo.phone,
						uniqueId,
						fromType: 2
					};
					deleteVisitorData(data).then(res => {
						userinfo.existVisitorData = false;
						this.$store.commit('set_userinfo', userinfo);
						let nowBookType = this.$store.getters.get_bookType();
						if (this.bookType != nowBookType) {
							this.bookType = nowBookType;
						}
						// if( userinfo.creditCardNum < 1 ){ //如果没有信用卡就跳转添加信用卡页面
						//   this.$router.push({
						//     path: "/editCard",
						//   });
						// }
					});
				});
		} else {
			let nowBookType = this.$store.getters.get_bookType();
			if (this.bookType != nowBookType) {
				this.bookType = nowBookType;
			}
			console.log('this.$router', this.$route);
			// if(userinfo.creditCardNum < 1){ //如果没有信用卡就跳转添加信用卡页面
			//   this.$router.push({
			//     path: "/editCard",
			//   });
			// }
		}
	},
	beforeRouteEnter(to, from, next) {
		// 判断如果是从登录页面跳转过来的 则 查询是否有游客数据
		console.log('beforeRouteEnter', from.path);
		next(vm => {
			vm.fromPath = from.path;
		});
	},
	activated() {},

	methods: {
		goLogin() {
			this.$router.push({
				path: '/notelogin'
			});
		},
		goPasswordLogin() {
			this.$router.push({
				path: '/passwordlogin'
			});
		},
		loginOut() {
			let uid = JSON.parse(localStorage.getItem('userInfo')).uid;
			loginOut({
				uid
			}).then(res => {
				console.log(res);
				localStorage.removeItem('token');
				localStorage.removeItem('userInfo');
				this.$router.push({
					path: '/login'
				});
			});
		},
		//
		handleBookType(item) {
			this.bookType = item.value;
			this.typePopupShow = false;
			changeAccount({
				bookType: this.bookType
			}).then(res => {
				this.$vtoast('切换成功');
				this.$store.commit('set_bookType', this.bookType);
				if (this.bookType == 0 && res.data < 1) {
					return this.$router.push({
						path: '/editCard'
					});
				}
				if(this.bookType == 0){
					this.manageCardHome()
				}
			});
		},
		// 获取页面信息
		manageCardHome() {
			manageCardHome().then(res => {
				this.cardInfo = res.data
				console.log('获取信用卡数', res,this.cardInfo);
				if (res.data.homeCreditResponseList && res.data.homeCreditResponseList.length <= 0) {
					this.bookType = 1;
					changeAccount({
						bookType: this.bookType
					}).then(res => {
						this.$store.commit('set_bookType', this.bookType); 
					});
				}
			});
		},
		// 点击账本
		handleTitle() {
			this.typePopupShow = true;
		}
	}
};
</script>

<style lang="less" scoped>
.index-box {
	background-color: #f3f3f3;
	min-height: 93.9vh;
	padding-bottom: 20px;

	// max-width: 100vw;
	.title {
		position: relative;
		// left: 40%;
		// padding:0px 30px;
		width: 100%;
		top: 26px;
		font-size: 34px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #ffffff;
		letter-spacing: 1px;
		z-index: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		// text-align: center;
	}
}

.wrapper {
	display: flex;
	// align-items: center;
	justify-content: center;
	// height: 100%;
}

.overlay-div {
	width: 100%;
	position: relative;
	// top: 0px;
	// height: 0%;
	background-color: #fff;
	border-radius: 0 0 25px 25px;

	.title {
		font-size: 34px;
		font-family: PingFang SC;
		font-weight: bold;
		color: #212121;
	}

	.overlay-bottom {
		display: flex;
		justify-content: space-between;
		padding: 75px 100px 0px 100px;

		.overlay-for {
			width: 240px;
			height: 168px;
			background: #ffffff;
			border: 4px solid #f1f1f1;
			border-radius: 20px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.dialog-name {
				margin-top: 10px;
				font-size: 30px;
				font-family: PingFang SC;
				font-weight: 500;
				color: #212121;
			}
		}

		.dialog-active {
			border: 4px solid #4475fe;
		}
	}
}
</style>
