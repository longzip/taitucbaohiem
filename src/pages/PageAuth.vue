<template>
  <q-page class="flex flex-center" padding>
    <q-card flat bordered style="width: 100%; max-width: 400px;">
      <q-card-section>
        <div class="text-h6">{{ isLogin ? 'Login' : 'Register' }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm">
          <q-input
            v-model="formData.username"
            label="Username"
            outlined
            required
          />
          <q-input
            v-model="formData.password"
            label="Password"
            type="password"
            outlined
            required
            class="q-mt-md"
          />

          <q-btn
            :label="isLogin ? 'Login' : 'Register'"
            type="submit"
            color="primary"
            class="q-mt-md full-width"
            :loading="loading"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="isLogin ? 'Need to register?' : 'Already registered?'"
          @click="isLogin = !isLogin"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import { LOGIN_USER } from 'src/mutations/login-user';

export default {
  name: 'PageAuth',
  setup() {
    const isLogin = ref(true);
    const router = useRouter();
    const formData = ref({
      username: '',
      password: ''
    });

    const { mutate: login, loading, error } = useMutation(LOGIN_USER, () => ({
      variables: {
        username: formData.value.username,
        password: formData.value.password
      }
    }));

    const submitForm = async () => {
      try {
        const result = await login();
        const { authToken, refreshToken } = result.data.login;
        // Store the token (e.g., in localStorage) and redirect
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('refreshToken', refreshToken);
        router.push('/');
      } catch (e) {
        console.error('Login failed:', e);
      }
    };

    return {
      isLogin,
      formData,
      submitForm,
      loading
    };
  }
};
</script>
