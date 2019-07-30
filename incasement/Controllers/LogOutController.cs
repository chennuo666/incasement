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
    public class LogOutController : ControllerBase
    {
        [HttpPost]
        public ReturnMsg logOut()
        {
            ReturnMsg status = new ReturnMsg() { Result = Login.LogOut() };
            return status;
        }
    }
}