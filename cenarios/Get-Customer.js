import http from "k6/http";
import { sleep } from "k6";
import { Trend, Rate, Counter } from "k6/metrics";
import { check, fail } from "k6";

//criar variáveis de métricas
// primeiro vamos criar uma que representa o tempo de milisegundos da requisição
export let GetCustomerDuration = new Trend('get_customer_duration'); // trend é uma métrica personalisada q permite um calculo diferente de estatisticas
//uma que representa a metrica de % de falhas da requisição de teste:
export let GetCustomerFailRate = new Rate('get_customer_fail_rate'); // rate é um objeto para representar uma metrica personalisada, q mantém um controle % de valores add que não são zeros
//uma que represnta a metrica de % de sucesso da requisição:
export let GetCustomerSuccessRate = new Rate('get_customer_success_rate');
//e uma que representa a metrica de % de requisição
export let GetCustomerReqs= new Rate('get_customer_reqs');

export default function () {
   let res = http.get('https://localhost:5001/api/Customer/GetCustomer?id=1')

   GetCustomerDuration.add(res.timings.duration);
   GetCustomerReqs.add(1);
   GetCustomerFailRate.add(res.status == 0 || res.status > 399); // verificação conforme a doc do k6,
   GetCustomerSuccessRate.add(res.status < 399);

   let durationMsg = 'Max Duration ${1000/1000}s'
   if(!check(res, {
      'max duration': (r) => r.timings.duration < 1000,
   })){
      fail(durationMsg);
   }
   sleep(1);
}