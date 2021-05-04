<template>
	<div class="view-login">
		<Card>
			<!--<template #header>
				<img alt="user header" src="demo/images/usercard.png">
			</template>-->
			<template #title>
				FitLayout Login
			</template>
			<template #content>
				<form @submit="submitForm">
					<div class="p-fluid form-content">
						<div class="p-field">
							<label for="userId">User ID</label>
							<InputText id="userId" type="text" v-model="userid" />
						</div>
						<div class="p-field">
							<label for="password">Password</label>
							<InputText id="password" type="password" v-model="password" />
						</div>
						<div class="error" v-if="error">
							<InlineMessage severity="error">{{error}}</InlineMessage>
						</div>
						<div class="buttons">
							<Button icon="pi pi-check" label="Login" type="submit" />
						</div>
					</div>
				</form>
			</template>
			<template #footer>
				<router-link to="/register">Register new user</router-link>
			</template>
		</Card>

	</div>
</template>

<script>
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InlineMessage from 'primevue/inlinemessage';

export default {
	name: 'login',
	components: {
		Card,
		Button,
		InputText,
		InlineMessage
	},
	//inject: ['apiClient'],
	data() {
		return {
			apiClient: null,
			userid: '',
			password: '',
			error: ''
		}
	},
	created () {
		this.apiClient = this.$root.apiClient;
	},
	methods: {
		async submitForm() {
			console.log('submit');
			try {
				await this.apiClient.login(this.userid, this.password);
				this.error = null;
				this.$router.push({name: 'home'});
			} catch (e) {
				this.error = "login failed";
			}
			return false;
		}
	}
}
</script>

<style>
.view-login {
	width: 40em;
	margin: auto;
	margin-top: 5em;
}
.view-login .form-content {
	overflow: hidden;
}
.view-login .buttons {
	float: right;
}
.view-login .error {
	float: left;
}
</style>
