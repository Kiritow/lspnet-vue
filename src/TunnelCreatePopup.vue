<template>
    <span>Create Tunnel for <code>{{ networkName }}</code></span>
    <el-row>
        <el-col :span="12">
            Proxy Host: 
            <el-select v-model="tunnelHostName" filterable default-first-option
                :reserve-keyword="false" placeholder="host name" style="width: 240px">
                <el-option v-for="item in tunnelHosts" :key="item.key" :label="item.value" :value="item.value" />
            </el-select>
        </el-col>
    </el-row>

    <el-row>
        Type: 
        <el-col :span="6">
            <el-select v-model="tunnelType" filterable default-first-option :reserve-keyword="false">
                <el-option v-for="item in allTunnelTypes" :key="item.key" :label="item.value" :value="item.value"/>
            </el-select>
        </el-col>
    </el-row>
    <el-row>
        Protocol:
        <el-col :span="6">
            <el-select v-model="protocol" filterable default-first-option :reserve-keyword="false">
                <el-option v-for="item in allProtocolTypes" :key="item.key" :label="item.value" :value="item.value"/>
            </el-select>
        </el-col>
    </el-row>
    <el-row>
        Listen Port:
        <el-col :span="6">
            <el-input-number v-model="listenPort"></el-input-number>
        </el-col>
    </el-row>

    <el-row>
        Target Host: 
        <el-col :span="12">
            <el-select v-model="targetHost" filterable clearable 
                :reserve-keyword="false" placeholder="host name" style="width: 240px">
                <el-option v-for="item in tunnelHosts" :key="item.key" :label="item.value" :value="item.value" />
            </el-select>
        </el-col>
    </el-row>

    <el-row>
        Target IP:
        <el-col :span="6">
            <el-input v-model="targetIP"></el-input>
        </el-col>
    </el-row>

    <el-row>
        Target Port:
        <el-col :span="6">
            <el-input-number v-model="targetPort"></el-input-number>
        </el-col>
    </el-row>

    <el-row>
        Description: 
        <el-col :span="12">
            <el-input v-model="description"></el-input>
        </el-col>
    </el-row>

    <el-row>
        <el-button type="primary" @click="createTunnel">Create</el-button>
    </el-row>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios';
import { ElMessage } from 'element-plus'
import { useTunnelHost } from './compose/TunnelHost'

const props = defineProps(['networkName'])

const { tunnelHosts, fetchData } = useTunnelHost(props.networkName)
const tunnelHostName = ref('')
const protocol = ref('tcp')
const tunnelType = ref('gost')
const listenPort = ref(0)
const targetHost = ref('')
const targetIP = ref('')
const targetPort = ref(0)
const description = ref('')

const allTunnelTypes = ['frp', 'gost'].map(t => ({ key: t, value: t}))
const allProtocolTypes = ['tcp', 'udp', 'http'].map(t => ({ key: t, value: t}))

async function createTunnel() {
    try {
        const res = (await axios.post('/admin/tunnel/create', {
            network: props.networkName,
            type: tunnelType.value,
            protocol: protocol.value,
            host: tunnelHostName.value,
            listen: listenPort.value,
            targetHost: targetHost.value,
            targetIP: targetIP.value,
            targetPort: targetPort.value,
            description: description.value,
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

onMounted(()=>{
    fetchData()
})

</script>

<style scoped>
.el-row {
    margin-bottom: 10px;
}
</style>
