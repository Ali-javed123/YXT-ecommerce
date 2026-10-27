
import { showToast } from '@/lib/showToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { boolean } from 'zod';

type DeleteType = 'PD' | 'PUT';
const useDeleteMutation = (
  queryKey: string,
  deleteEndPoint: string
) => {
  const queryClient=useQueryClient()
  return useMutation({
    mutationFn: async ({
      ids,
      deleteType,
    }: {
      ids: string[];
      deleteType: DeleteType;
    }) => {
      const response = await axios({
        url: deleteEndPoint,
        method: deleteType === 'PD' ? 'DELETE' : 'PUT',
        data: { ids, deleteType},
      });

      if (response.data?.success === false) {
        throw new Error(response.data?.message || 'Request failed');
      }
      console.log('response',response)
      console.log('res',response.data.massege)
      showToast({type:"success",content:response.data.message})


      return response;
    },

    onSuccess: (data:any) => {
queryClient.invalidateQueries({
  queryKey: [queryKey],
});
      showToast({type:"success",content:data.massege})
    },
    onError:(error:any)=>{
      showToast({type:"error",content:error.massege})

    }
  });
};

export default useDeleteMutation;
