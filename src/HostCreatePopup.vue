<template>
    <span>Create Host for <code>{{ networkName }}</code></span>
    <el-row>
        <el-col :span="12">
            <el-input v-model="hostName" placeholder="Host Name"/>
        </el-col>
        <el-col :span="12">
            <el-input v-model="hostIP" placeholder="Host IP"/>
        </el-col>
    </el-row>
    <el-row>
        frp server port: <el-input-number v-model="frpsPort"></el-input-number>
    </el-row>
    <el-row>
        <el-button type="primary" @click="createHost">Create</el-button>
    </el-row>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios';
import { ElMessage } from 'element-plus'

const props = defineProps(['visible', 'networkName'])

const hostName = ref('')
const hostIP = ref('')
const frpsPort = ref(7000)

async function createHost() {
    try {
        const res = (await axios.post('/admin/host/create', {
            network: props.networkName,
            host: hostName.value,
            ip: hostIP.value,
            frpsPort: frpsPort.value,
        })).data
        console.log(res)
        ElMessage({
            message: res.message,
            type: 'info',
        })
    } catch (e) {
        console.log(e)
        if (e.response.data?.message) {
            ElMessage({
                message: e.response.data.message,
                type: 'error',
            })
        } else {
            ElMessage({
                message: e.message,
                type: 'error',
            })
        }
    }
}

</script>
