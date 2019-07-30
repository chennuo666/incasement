using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using incasement.Models;
using System.Net.Http;

namespace incasement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeleteProgramController : ControllerBase
    {
        [HttpPost]
        public ReturnMsg Delete(ReturnMsg rm)
        {
            int ID = rm.Result;
            string strsql = "delete from Program where ID=" + ID;
            if (DBconnect.noQueryDB(strsql) == 1)
            {
                return new ReturnMsg() { Result = 1 };
            }
            else
            {
                return new ReturnMsg() { Result = 0 };
            }
        }
    }
}