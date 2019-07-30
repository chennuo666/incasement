using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Net;
using Microsoft.AspNetCore.Hosting;

namespace incasement.Controllers
{
    public class LoaderController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private static string contentRootPath;
        public LoaderController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
            contentRootPath = _hostingEnvironment.ContentRootPath; ;
        }
        public ActionResult GetTemplate()
        {
            try
            {
                var addrUrl = contentRootPath + "/wwwroot/Files/LoadTemplate.xlsx";
                var stream = System.IO.File.OpenRead(addrUrl);
                return File(stream, "application/ms-excel", "导入模板.xlsx");
            }
            catch
            {
                return null;
            }
        }
    }
}