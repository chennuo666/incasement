using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Web.Http;
using incasement.Models;
using System.Data;

namespace incasement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UpdateProgramNameController : ControllerBase
    {
        [HttpPost]
        public Output Update(Output op)
        {
            Account act = Login.Get_user();
            if (act != null && !string.IsNullOrEmpty(act.ID))
            {
                int ID = op.status;
                string name = op.reg[0];
                string strsql = "update Program set programName='" + name + "' where ID=" + ID;
                int status = DBconnect.noQueryDB(strsql);
                if (status == 1)
                {
                    strsql = "select programName from Program where ID=" + ID;
                    name = SqlHelper.ExecuteScalar(DBconnect.get(), CommandType.Text, strsql).ToString();
                    Output output = new Output(1, name);
                    return output;
                }
                else
                {
                    Output output = new Output(0, "修改失败");
                    return output;
                }
            }
            else
            {
                Output output = new Output(-10, "请先登录");
                return output;
            }
        }
    }
}