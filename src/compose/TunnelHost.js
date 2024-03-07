import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus'

export function useTunnelHost(networkName) {
  const tunnelHosts = ref([]);

  const fetchData = async () => {
    const res = (
      await axios.get("/admin/host/list", {
        params: {
          network: networkName,
        },
      })
    ).data;
    console.log(res);

    if (res.message != "ok") {
      ElMessage({
        message: res.message,
        type: "error",
      });
      return;
    }

    tunnelHosts.value = res.data.map((row) => ({
      key: row.host,
      value: row.host,
    }));
  };

  return { tunnelHosts, fetchData };
}
