using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using Newtonsoft.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace incasement.Models
{
    public static class Login
    {
        static private SqlConnection conn = DBconnect.get();


        public static void tiaoshi()//调试
        {
            Account act = new Account("2", "aa", "11");
            HttpContext.Current.Session.Set("account", HttpContext.ObjectToBytes(act));
            HttpCookie cookie = new HttpCookie(act);
            HttpContext.Current.Response.Cookies.Append(cookie.key, cookie.value);
        }
        public static void Log()
        {
            byte[] session_value;
            if (HttpContext.Current.Session.TryGetValue("account", out session_value))
            {
                HttpCookie cookie1 = new HttpCookie((Account)HttpContext.BytesToObject(session_value));
                HttpContext.Current.Response.Cookies.Append(cookie1.key, cookie1.value);
            }
        }
        public static int checklog()//判断是否已登录
        {
            Log();
            byte[] session_value;
            if (HttpContext.Current.Session.TryGetValue("account", out session_value))
            {
                if (((Account)HttpContext.BytesToObject(session_value)).userName == "")
                    return 0;
                else return 1;
            }
            else
            {
                return 0;
            }
        }
        public static int Log(Account user)//登录
        {
            if (checklog() != 0) return 0;//若已登录返回0
            string sqlstr;
            sqlstr = "select * from Account where userName='" + user.userName + "'";
            SqlDataReader sdr = SqlHelper.ExecuteReader(conn, CommandType.Text, sqlstr);
            if (sdr.Read())
            {
                if (sdr["password"].ToString() == user.pwd)
                {
                    user.userName = sdr["userName"].ToString();
                    user.ID = sdr["ID"].ToString();
                    HttpContext.Current.Session.Set("account", HttpContext.ObjectToBytes(user));
                    HttpCookie cookie = new HttpCookie(user);
                    HttpContext.Current.Response.Cookies.Append(cookie.key, cookie.value, new CookieOptions() { IsEssential = true });
                    sdr.Close();
                    return 1;
                }
                else
                {
                    sdr.Close();
                    return -1;
                }
            }
            else
            {
                sdr.Close();
                return -2;
            }
        }
        public static int LogOut()
        {
            HttpContext.Current.Session.Remove("account");
            HttpContext.Current.Response.Cookies.Delete("account");
            if (checklog() == 0) return 1;
            else return 0;
        }
        public static Account Get_user()//获取登录用户信息
        {
            Account user = null;
            if (checklog() == 0) return null;//若未登录返回null
            byte[] value;
            if (HttpContext.Current.Session.TryGetValue("account", out value))
            {
                user = ((Account)HttpContext.BytesToObject(value));
                user.pwd = "";
                return user;
            }
            else return null;

        }
        public static int Register(Account user)
        {
            if (user.userName != null && user.userName != "")
            {
                string strsql = "select * from Account where userName='" + user.userName + "'";
                SqlDataReader sdr = SqlHelper.ExecuteReader(conn, CommandType.Text, strsql);
                if (sdr.Read())
                {
                    sdr.Close();
                    return 0;
                }
                else
                {
                    sdr.Close();
                    if (user.pwd != null && user.pwd != "")
                    {
                        strsql = "insert into Account(userName,password) values('" + user.userName + "','" + user.pwd + "')";
                        DBconnect.noQueryDB(strsql);
                        return 1;
                    }
                    else return -1;
                }
            }
            else
            {
                return -2;
            }
        }
    }
    [Serializable]
    public class Account //账户类
    {
        public string ID { get; set; }
        public string userName { get; set; }
        public string pwd { get; set; }
        public Account(string ID, string userName, string pwd)
        {
            this.ID = ID;
            this.userName = userName;
            this.pwd = pwd;
        }
    }
    public class HttpCookie
    {
        public string key { get; set; }
        public string value { get; set; }
        public HttpCookie(Account account)
        {
            this.key = "account";
            this.value = JsonConvert.SerializeObject(account);
        }
        public HttpCookie(string value)
        {
            this.key = "account";
            this.value = value;
        }
        public Account Cookies2Account()
        {
            Account act = (Account)JsonConvert.DeserializeObject(this.value);
            return act;
        }
    }
}