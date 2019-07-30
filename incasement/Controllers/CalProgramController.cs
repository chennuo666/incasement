using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using incasement.Models;
using Newtonsoft.Json;
using System.Data;
using System.Net.Http;

namespace incasement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalProgramController : ControllerBase
    {
        [HttpPost]
        public Output[] GetCalingProgram()
        {
            Account act = Login.Get_user();
            List<Output> outputs = new List<Output>();
            if (act != null && !string.IsNullOrEmpty(act.ID))
            {
                DataTable dt = DBconnect.selectDB("TempProgram", " where userID=" + act.ID);
                if (dt == null || dt.Rows.Count == 0)
                {
                    return outputs.ToArray();
                }
                else
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        if (dt.Rows[i]["status"].ToString() == "0")
                        {
                            Output output = new Output(0, "正在计算");
                            outputs.Add(output);
                        }
                        else if (Convert.IsDBNull(dt.Rows[i]["program"]) || dt.Rows[i]["program"].ToString() == ""|| dt.Rows[i]["program"].ToString().Length<=10)
                        {
                            string name = dt.Rows[i]["programName"].ToString();
                            string strsql = "delete TempProgram where ID=" + dt.Rows[i]["ID"].ToString();
                            DBconnect.noQueryDB(strsql);
                            Output output = new Output(-2, name + " 方案无法计算出可行解，请更换算法重试");
                            output.reg = new string[1] { dt.Rows[i]["ID"].ToString() };
                            outputs.Add(output);
                        }
                        else
                        {
                            string ID = dt.Rows[i]["ID"].ToString();
                            string strsql = "delete TempProgram where ID=" + ID;
                            DBconnect.noQueryDB(strsql);
                            strsql = "insert into Program(userID,program,OAtype,programName) values(" + dt.Rows[0]["userID"].ToString() + ",'" + dt.Rows[0]["program"].ToString() + "'," + dt.Rows[0]["OAtype"].ToString() + ",'" + dt.Rows[0]["programName"].ToString() + "')";
                            DBconnect.noQueryDB(strsql);
                            strsql = "select ident_current('Program')";
                            int p_ID = Decimal.ToInt32(((Decimal)SqlHelper.ExecuteScalar(DBconnect.get(), CommandType.Text, strsql)));
                            Output output = new Output(p_ID, dt.Rows[0]["program"].ToString());
                            output.reg = new string[3] { dt.Rows[0]["OAtype"].ToString(), dt.Rows[0]["programName"].ToString(), ID };
                            outputs.Add(output);
                        }
                    }
                    return outputs.ToArray();
                }
            }
            else
            {
                Output output = new Output(-10, "请先登录");
                outputs.Add(output);
                return outputs.ToArray();
            }
        }
    }
}