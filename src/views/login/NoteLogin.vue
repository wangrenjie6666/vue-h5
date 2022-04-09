<template>
	<div>
		<div class="cell-group-box">
			<van-cell-group :border="false">
				<van-field v-model="form.account" placeholder="请输入手机号" type="tel" clearable />
				<van-field v-model="form.smsCode" placeholder="请输入验证码" clearable style="margin-top: 15px">
					<template #button>
						<a-button v-if="!send" class="code-button" type="link" @click="handleCode">
							获取验证码
						</a-button>
						<span v-if="send" class="count">{{ count }} s</span>
					</template>
				</van-field>
				<div></div>
			</van-cell-group>
			<div class="submit-box">
				<van-button class="submit-bottom" block @click="handleSubmit"
					:disabled="!form.account || !form.smsCode">登录</van-button>
			</div>
		</div>

	</div>
</template>

<script>
	import {
		sendNote,
		codeLogin
	} from '@/api/login.js';
	export default {
		name: "noteLogin",
		data() {
			return {
				send: false,
				count: "",
				timer: null,
				form: {},
				disabled: true,
			};
		},
		created() {
			this.form = {
				account: this.$store.getters.get_account()
			}
			this.count = this.store_state_codeTime;
			this.send = this.store_state_send;
			// console.log('created',this.codeTime)
		},
		mounted() {
			// console.log('mounted')
		},

		methods: {
			//   验证表单
			onFailed(errorInfo) {
				console.log("failed", errorInfo);
			},
			// 登录
			handleSubmit() {
				// if (!this.$regex.mobileRegex.test(this.form.account)) {
				//   return this.$vtoast("请输入正确手机号");
				// }else 
				if (!this.form.smsCode) {
					return this.$vtoast("请输入验证码");
				}
				let form = {
					...this.form
				}
				form = JSON.parse(JSON.stringify(form).replace(/account/g, "phone"))
				let uniqueId = this.$store.getters.get_uniqueId()
				form.uniqueId = uniqueId
				form.fromType = 2;
				console.log(form)
				codeLogin(form).then(res => {
					console.log(res)
					this.$store.commit('set_userinfo', res.data)
					this.$store.commit('set_uid', res.data.uid)
					this.$store.commit('set_token', res.data.token)
					this.$vtoast("登录成功");
					setTimeout(() => {
						this.$router.push({
							path: '/index'
						})
					}, 1000);
				})
			},
			// 获取验证码
			handleCode() {
				if (!this.$regex.mobileRegex.test(this.form.account)) {
					return this.$vtoast("请输入正确手机号");
				}
				let data = {
					account: this.form.account,
					smsType: 'login',
				}
				sendNote(data).then((res) => {
					if (res.data.code == 0) {
						this.$vtoast(res.data.data.msg)
						if(res.data.data.status == 0){
							this.$store.commit('send_loginCode')
						}
					}
				})
			},
		}, 
		computed: {
		  store_state_codeTime() {
		    return this.$store.getters.get_codeTime();
		  },
		  store_state_send() {
		    return this.$store.getters.get_send();
		  },
		},
		//监听执行
		watch: {
		  store_state_codeTime() {
		    this.codeTime = this.store_state_codeTime;
			this.count = this.codeTime
		    console.log("this.codeTime", this.codeTime);
		  },
		  store_state_send(){
		    this.send = this.store_state_send;
		  },
		},
	};
</script>

<style lang="less" scoped>
	.cell-group-box {
		padding-bottom: 50px;

		//   margin-top: 20px;
		/deep/ .van-cell {
			padding: 13px 20px !important;
		}

		/deep/ .van-field__label,
		/deep/ .van-cell__title {
			font-size: 14px;
			font-family: PingFang SC;
			font-weight: 500;
			color: #212121;
		}

		/deep/ .van-field__value,
		/deep/ .van-cell__value {
			font-size: 17px;
			font-family: PingFang SC;
			// font-weight: bold;
			color: #212121;
		}

		/deep/ .van-cell-group,
		/deep/ .van-cell {
			background-color: rgba(0, 0, 0, 0);
		}
	}

	.code-button {
		z-index: 2000;
		//   border: 0px;
		height: 45px;
		font-size: 28px;
		font-family: PingFang SC;
		font-weight: 500;
		color: #367ff9;
	}

	.count {
		font-size: 28px;
		font-family: PingFang SC;
		font-weight: 500;
		color: #999999;
	}

	.submit-bottom {
		font-size: 32px;
		letter-spacing: 1px;
		font-family: PingFang SC;
		font-weight: bold;
	}
</style>
