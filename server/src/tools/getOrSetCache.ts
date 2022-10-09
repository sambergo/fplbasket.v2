import { redisClient } from "../tools/redisConnection";

export const getOrSetCache = async (
  redisKey: string,
  cb: Function,
  params: any = null
): Promise<any> => {
  return new Promise((resolve, reject) => {
    redisClient.get(redisKey, async (error, data) => {
      if (error) return reject(error);
      if (data) return resolve(JSON.parse(data));
      try {
        const { freshData, ex } = await cb(params);
        if (freshData && ex)
          redisClient.setex(redisKey, parseInt(ex), JSON.stringify(freshData));
        resolve(freshData);
      } catch (error) {
        reject(error);
      }
    });
  });
};
