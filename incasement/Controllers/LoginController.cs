using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using incasement.Models;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;

namespace incasement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        [HttpPost]
        public ReturnMsg Log(Account user)//登录api
        {
            ReturnMsg status = new ReturnMsg() { Result = Login.Log(user) };
            //HttpResponseMessage result = new HttpResponseMessage { Content = new StringContent(JsonConvert.SerializeObject(status), Encoding.GetEncoding("UTF-8"), "application/json") };
            //return result;
            return status;
        }
        [HttpGet]
        public Account GET_USER()//得到登录用户信息
        {
            Account user = Login.Get_user();
            return user;
        }
    }
    public class ReturnMsg
    {
        public int Result { get; set; }
    }
}