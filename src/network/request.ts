import axios, { AxiosRequestConfig } from 'axios'
axios.defaults.withCredentials = true;
export function request(config?: AxiosRequestConfig){
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      timeout: 5000,
      headers: {
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache'
      },
    })
    // @ts-ignore
    instance(config)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })

  })
}
