using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;

namespace incasement.Models
{
    public class Input
    {
        public ContainerType ct;
        public CargoNum[] cn;
        public int type;
        public string name;
    }
    public class Output
    {
        public int status { get; set; }
        public string message { get; set; }
        public string[] reg { get; set; }
        public Output(int status,string message)
        {
            this.status = status;
            this.message = message;
        }
    }
}