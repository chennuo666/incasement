using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Web.Http;
using incasement.Models;
using Newtonsoft.Json;
using System.Data;

namespace incasement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OAController : ControllerBase
    {
        [HttpPost]
        public async Task<int> Install(Input input)
        {
            try
            {
                if (Models.Login.checklog() == 0)
                {
                    return -10;
                }
                else
                {
                    Account act = Login.Get_user();
                    ContainerType ct = input.ct;
                    ct.resort();
                    CargoNum[] cn = input.cn;
                    string name = input.name;
                    for (int i = 0; i < cn.Length; i++)
                    {
                        cn[i].calArea();
                    }
                    string strSql;
                    strSql = "select COUNT(*) from TempProgram where userID=" + act.ID;
                    int num = int.Parse(SqlHelper.ExecuteScalar(DBconnect.get(), CommandType.Text, strSql).ToString());
                    if (num == 3) return -1;
                    strSql = "insert into TempProgram(userID,status,OAtype,programName) values(" + act.ID.ToString() + ",0," + input.type.ToString() + ",'" + name + "')";
                    DBconnect.noQueryDB(strSql);
                    strSql = "select ident_current('TempProgram')";
                    int p_ID = Decimal.ToInt32(((Decimal)SqlHelper.ExecuteScalar(DBconnect.get(), CommandType.Text, strSql)));
                    Task.Run(() => calProgram(ct, cn, input.type, p_ID));
                    //Task.Factory.StartNew(() => calProgram(ct, cn, input.type, p_ID), TaskCreationOptions.LongRunning);
                    return p_ID;
                }
            }
            catch (Exception ex)
            {
                return 0;
            }
        }
        public static void calProgram(ContainerType ct, CargoNum[] cn, int type, int ID)
        {
            incasement.Models.Program program;
            switch (type)
            {
                case 0:
                    {
                        program = OptimalAlgorithm.SmartChoice(ct, cn, ref type);
                        break;
                    }
                case 1:
                    {
                        program = OptimalAlgorithm.RSO_3D(ct, cn);
                        break;
                    }
                case 2:
                    {
                        program = OptimalAlgorithm.GA_3D(ct, cn);
                        break;
                    }
                case 3:
                    {
                        program = OptimalAlgorithm.CHNN_3D(ct, cn);
                        break;
                    }
                case 4:
                    {
                        program = OptimalAlgorithm.HGSAA_3D(ct, cn);
                        break;
                    }
                default:
                    {
                        program = OptimalAlgorithm.RSO_3D(ct, cn);
                        break;
                    }
            }
            string strSql = "update TempProgram set status=1,program='" + JsonConvert.SerializeObject(program) + "',finishtime=getdate(),OAtype=" + type + " where ID=" + ID;
            DBconnect.noQueryDB(strSql);
        }
    }
}