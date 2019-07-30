using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using System.Threading.Tasks;

namespace incasement.Models
{
    public static class DBconnect
    {
        public static SqlConnection get() {
            //SqlConnection conn = new SqlConnection("Data Source = 47.100.177.82,1433; Initial Catalog = Incasement;User ID=SA;Password=Ab825710392;");
            SqlConnection conn = new SqlConnection("Data Source = localhost; Initial Catalog = Incasement;User ID=SA;Password=Ab825710392;");
            return conn;
        }
        public static DataTable selectDB(string db)//得到整个数据库数据
        {
            string strsql = "select * from " + db;
            return SqlHelper.ExecuteDataset(get(), CommandType.Text, strsql).Tables[0];
        }
        public static DataTable selectDB(string db,string col,string col_data)//得到db数据库的col属性名中数据为col_data的记录
        {
            string strsql = "select * from " + db + " where " + col + "=" + col_data + "";
            return SqlHelper.ExecuteDataset(get(), CommandType.Text, strsql).Tables[0];
        }
        public static DataTable selectDB(string db, string[] col_array)//得到db数据库的col_array列名
        {
            string strsql = "select ";
            foreach(string str in col_array)
            {
                strsql += str + ",";
            }
            strsql += " from " + db;
            return SqlHelper.ExecuteDataset(get(), CommandType.Text, strsql).Tables[0];
        }
        public static DataTable selectDB(string db, string[] col_array, string col, string col_data)//得到db数据库的col属性名中数据为col_data的col_array[]字段的记录
        {
            string strsql = "select ";
            foreach (string str in col_array)
            {
                strsql += str + ",";
            }
            strsql = strsql.Substring(0, strsql.Length - 1);
            strsql += " from " + db + " where " + col + "=" + col_data + "";
            return SqlHelper.ExecuteDataset(get(), CommandType.Text, strsql).Tables[0];
        }
        public static DataTable selectDB(string db,string condition)//自定义查询条件
        {
            string strsql = "select * from "+db+condition;
            return SqlHelper.ExecuteDataset(get(), CommandType.Text, strsql).Tables[0];
        }
        public static int insertDB(string db, string[] col_array, string[] col_data)
        {
            string strsql = "insert into " + db + "(";
            foreach (string str in col_array)
            {
                strsql += str + ",";
            }
            strsql = strsql.Substring(0, strsql.Length - 1);
            strsql += ") values(";
            foreach(string str in col_data)
            {
                strsql += str + ",";
            }
            strsql = strsql.Substring(0, strsql.Length - 1);
            strsql += ")";
            return SqlHelper.ExecuteNonQuery(get(), CommandType.Text, strsql);
        }
        public static int noQueryDB(string strSql)
        {
            return SqlHelper.ExecuteNonQuery(get(), CommandType.Text, strSql);
        }
    }
}