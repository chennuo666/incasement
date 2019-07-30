using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.Text;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;

namespace incasement.Models
{
    public class HttpResult
    {
        public static HttpResponseMessage Get_Result(object oj)
        {
            HttpResponseMessage result = new HttpResponseMessage { Content = new StringContent(JsonConvert.SerializeObject(oj), Encoding.GetEncoding("UTF-8"), "application/json") };
            return result;
        }
    }
}