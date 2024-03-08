<template>
  <main>
    <el-row>
      <span>Admin Panel | User: {{ username }}</span>
    </el-row>
    <el-row>
      <el-button type="primary" @click="popupCliToken">CLI Token</el-button>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-input v-model="networkName" placeholder="Network Name"/>
      </el-col>
      <el-col :span="18">
        <el-button type="primary" @click="loadNetworkTunnel">Check</el-button>
        <el-button type="primary" @click="isVisibleTokenPopup2 = true">Tunnel Token</el-button>
        <el-button type="primary" @click="isVisibleTokenPopup3 = true">New Host</el-button>
        <el-button type="primary" @click="isVisibleTokenPopup4 = true">New Tunnel</el-button>
      </el-col>
    </el-row>

    <el-row v-if="networkData != null">
      <el-col :span="24">
        <el-table :data="networkData" border style="width: 100%" table-layout="auto">
          <el-table-column prop="id" label="ID" />
          <el-table-column prop="network" label="Network"/>
          <el-table-column prop="host" label="Host"/>
          <el-table-column prop="type" label="Type" />
          <el-table-column prop="protocol" label="Protocol" />
          <el-table-column prop="listen" label="Listen" />
          <el-table-column prop="status" label="Status" />
          <el-table-column prop="targetHost" label="TargetHost" />
          <el-table-column prop="targetIP" label="TargetIP" />
          <el-table-column prop="targetPort" label="TargetPort" />
          <el-table-column fixed="right" label="Operations">
            <template #default="scope">
              <el-button v-if="!scope.row.status" link type="primary" size="small" @click="enableTunnel(scope.row.id)">Enable</el-button>
              <el-button v-if="scope.row.status" link type="danger" size="small" @click="disableTunnel(scope.row.id)">Disable</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog v-model="isVisibleTokenPopup" title="Token" width="500">
      <span>For CLI Usage: </span>
      <code>{{ cliToken }}</code>
      <el-button type="primary" @click="copyCliToken">Copy</el-button>
    </el-dialog>

    <el-dialog v-model="isVisibleTokenPopup2" title="Tunnel Token" width="500">
      <TunnelTokenPopup :network-name="networkName"></TunnelTokenPopup>
    </el-dialog>

    <el-dialog v-model="isVisibleTokenPopup3" title="Create Host">
      <HostCreatePopup :network-name="networkName"></HostCreatePopup>
    </el-dialog>

    <el-dialog v-model="isVisibleTokenPopup4" title="Create Tunnel">
      <TunnelCreatePopup :network-name="networkName"></TunnelCreatePopup>
    </el-dialog>

  </main>
</template>

<style scoped>
.el-row {
  margin-bottom: 10px;
}
</style>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios';
import TunnelTokenPopup from '@/TunnelTokenPopup.vue'
import HostCreatePopup from '@/HostCreatePopup.vue';
import TunnelCreatePopup from '@/TunnelCreatePopup.vue';

const username = ref('')
const networkName = ref('')
const networkData = ref(null)

const isVisibleTokenPopup = ref(false)
const cliToken = ref('')

const isVisibleTokenPopup2 = ref(false)
const isVisibleTokenPopup3 = ref(false)
const isVisibleTokenPopup4 = ref(false)


async function loadNetworkTunnel() {
  const res = (await axios.get('/admin/tunnel/list', {
    params: {
      network: networkName.value,
    }
  })).data
  networkData.value = res.data
}

async function loadUserInfo() {
  const res = (await axios.get('/admin/user')).data
  if (!res.data?.username) {
    return false
  }
  username.value = res.data.username
  return true
}

async function popupCliToken() {
  const res = (await axios.post('/admin/token')).data
  if (res.data?.token) {
    cliToken.value = res.data.token
  } else {
    cliToken.value = ''
    ElMessage({
      message: res.message,
      type: 'error',
    })
  }

  isVisibleTokenPopup.value = true
}

async function copyCliToken() {
  if (cliToken.value) {
    navigator.clipboard.writeText(cliToken.value)
    ElMessage({
      message: 'Copied',
      type: 'success',
    })
  }
}

async function enableTunnel(id) {
  const res = (await axios.post('/admin/tunnel/enable', { id })).data
  ElMessage({ message: res.message, type: 'info' })
  await loadNetworkTunnel()
}

async function disableTunnel(id) {
  const res = (await axios.post('/admin/tunnel/disable', { id })).data
  ElMessage({ message: res.message, type: 'info' })
  await loadNetworkTunnel()
}

onMounted(async ()=>{
  const isReady = await loadUserInfo()
  if(!isReady) {
    console.log(`user not logged in, redirect to login...`)
    ElMessage({ message: 'logging in...', type: 'warning' })
    window.location.href = '/auth/login/github'
    return
  }
})

</script>
