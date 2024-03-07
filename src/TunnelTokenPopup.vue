<template>
  <span>For <code>{{ networkName }}</code> Tunnel Usage: </span>
  <el-row>
    <el-col :span="12">
      <el-select v-model="tunnelTokenHostName" filterable allow-create default-first-option :reserve-keyword="false"
        placeholder="host name" style="width: 240px">
        <el-option v-for="item in tunnelHosts" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-col>
    <el-col :span="12">
      <el-button type="primary" @click="loadNetworkTunnelToken">Create Token</el-button>
    </el-col>
  </el-row>
  <code>{{ tunnelToken }}</code>
  <el-button type="primary" @click="copyTunnelToken">Copy</el-button>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios';
import { ElMessage } from 'element-plus'

const props = defineProps(['visible', 'networkName'])

const tunnelToken = ref('')
const tunnelTokenHostName = ref('')
const tunnelHosts = ref([])

async function loadNetworkTunnelToken() {
  const res = (await axios.post('/admin/tunnel/token', {
    network: props.networkName,
    host: tunnelTokenHostName.value,
  })).data

  console.log(res)
  if (res.data?.token) {
    tunnelToken.value = res.data.token
  } else {
    tunnelToken.value = ''
    ElMessage({
      message: res.message,
      type: 'error',
    })
  }
}

async function loadTunnelHosts() {
  const res = (await axios.get('/admin/host/list', {
    params: {
      network: props.networkName,
    }
  })).data
  console.log(res)

  if (res.message != 'ok') {
    ElMessage({
      message: res.message,
      type: 'error',
    })
    return
  }

  tunnelHosts.value = res.data.map(row => ({
    key: row.host,
    value: row.host,
  }))
}

async function copyTunnelToken() {
  if (tunnelToken.value) {
    navigator.clipboard.writeText(tunnelToken.value)
    ElMessage({
      message: 'Copied',
      type: 'success',
    })
  }
}

onMounted(()=>{
  console.log(props.networkName)
  loadTunnelHosts()
})

</script>