using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Web.Http;
using incasement.Models;

namespace incasement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        [HttpPost]
        public ReturnMsg Reg(Account user)//登录api
        {
            ReturnMsg status = new ReturnMsg() { Result = Login.Register(user) };
            return status;
        }
    }
}