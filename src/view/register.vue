<script setup>
import {reactive, ref} from "vue";
import {alertFail, showFail, showSuccess} from "../util/showMessages.js";
import {userRegister} from "../api/index.js";
import {useRouter} from "vue-router";
import {Add} from "@nutui/icons-vue";

const router = useRouter()

const formData = reactive({
    email:"",
    password:"",
    password2:""
})
const formRef = ref(null)

const customBlurValidate =(prop) =>{
    formRef.value?.validate(prop).then()
}
const passwordLengthValidate = (val) =>{
    if (val){
        if (val.length > 2){
            return Promise.resolve()
        }else{
            return Promise.reject("密码长度必须大于2位")
        }
    }else{
        return Promise.reject("密码不能为空")
    }
}
const passwordIsSameValidate = (val) =>{
    if (val == formData.password){
        return Promise.resolve()
    }else{
        return Promise.reject("两次密码不一致")
    }
}

const register = async () =>{
    formRef.value?.validate().then(async ({valid,errors}) =>{
        showSuccess(register.name,valid,errors)
        if (valid){
            let registerData = {
                email:formData.email,
                password:formData.password
            }
            userRegister(registerData)
                .then(res =>{
                    router.push({name:'userInfo'})
                })
        }else{
            showFail(register.name,errors)
            alertFail(register.name,errors[0].message)
        }
    })
}
</script>

<template>
    <nut-row type="flex" justify="center">
        <nut-col :span="8">
            <Add color="darkblue" width="100%" height="40vh"/>
        </nut-col>
    </nut-row>
    <nut-row type="flex" justify="center">
        <nut-col :span="18">
            <nut-form ref="formRef" :model-value="formData" :rules="{
                email:[
                    {required:true,message:'请输入邮箱'},
                    {regex:/^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,message:'请输入正确的邮箱'}
                ],
                password:[
                    {required:true,message:'密码不为空'},
                    {validator:passwordLengthValidate,message:'密码长度必须大于2位'},
                ],
                password2:[
                    {required:true,message:'确认密码不为空'},
                    {validator:passwordIsSameValidate,message:'两次密码不一致'}
                ]
            }">
                <nut-form-item label="Email" prop="email">
                    <nut-input
                        v-model="formData.email"
                        placeholder="请输入邮箱"
                        clearable
                        @blur="customBlurValidate('email')"
                        type="text"
                    />
                </nut-form-item>
                <nut-form-item label="密码" prop="password">
                    <nut-input
                        v-model="formData.password"
                        placeholder="请输入密码"
                        clearable
                        @blur="customBlurValidate('password')"
                        type="password"
                    />
                </nut-form-item>
                <nut-form-item label="确认密码" prop="password2">
                    <nut-input
                        v-model="formData.password2"
                        placeholder="请再次输入密码"
                        clearable
                        @blur="customBlurValidate('password2')"
                        type="password"
                    />
                </nut-form-item>
            </nut-form>
        </nut-col>
    </nut-row>
    <div class="center">
        <nut-button type="info" @click="register">注册</nut-button>
    </div>
</template>

<style scoped>
.center{
    display: flex;
    justify-content: center;
}
</style>