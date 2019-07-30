using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using incasement.Models;
using System.Web;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace incasement.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            if (Models.Login.checklog() == 0) return Redirect("/HOME/Login");
            else return new VirtualFileResult("Index.html", "text/html");

        }
        public ActionResult Login()
        {
            if (Models.Login.checklog() == 0) return new VirtualFileResult("Login.html", "text/html");
            else return Redirect("/HOME/Index");
        }
        public ActionResult Draw()
        {
            return new VirtualFileResult("Draw.html", "text/html");
        }
        public ActionResult Register()
        {
            if (Models.Login.checklog() == 0) return new VirtualFileResult("Register.html", "text/html");
            else return Redirect("/HOME/Index");
        }
        public ActionResult Intro()
        {
            if (Models.Login.checklog() == 1) return new VirtualFileResult("Intro.html", "text/html");
            else return Redirect("/HOME/Login");
        }
        public ActionResult UserPage()
        {
            if (Models.Login.checklog() == 1) return new VirtualFileResult("UserPage.html", "text/html");
            else return Redirect("/HOME/Login");
        }
    }
}