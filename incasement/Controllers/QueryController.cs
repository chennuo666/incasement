using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using incasement.Models;
using System.Data;

namespace incasement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QueryController : ControllerBase
    {
        [HttpPost]
        public DataTable QUERY(DB_class db)//对数据库查询
        {
            DataTable dt = null;
            if (db.db != null && db.col_array != null && db.col_data != null && db.col != null)
            {
                dt = DBconnect.selectDB(db.db, db.col_array, db.col, db.col_data);
            }
            else if (db.db != null && db.col_data != null && db.col != null)
            {
                dt = DBconnect.selectDB(db.db, db.col, db.col_data);
            }
            else if (db.db != null && db.col_array != null)
            {
                dt = DBconnect.selectDB(db.db, db.col_array);
            }
            else if (db.db != null && db.condition != null)
            {
                dt = DBconnect.selectDB(db.db, db.condition);
            }
            else if (db.db != null)
            {
                dt = DBconnect.selectDB(db.db);
            }
            return dt;
        }
    }
    public class DB_class//数据库对象类
    {
        public string db { get; set; }
        public string col { get; set; }
        public string col_data { get; set; }
        public string[] col_array { get; set; }
        public string[] insert_col_data { get; set; }
        public string condition { get; set; }
    }
}