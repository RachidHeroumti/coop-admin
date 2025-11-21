import api from "../lib/api";


const useDashboard = () => {

const fetchCounts  = async()=>{
    try {
        const response: any = await api.get('/analytics/counts');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch counts:', error);
        return {};
      }
}


  return {
    fetchCounts,
  };
};

export default useDashboard;
