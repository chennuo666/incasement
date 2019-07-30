using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;

namespace incasement.Models
{
    public class Program
    {
        public CargoNum[] cargos_num;//种类的数组
        public Container[] containers;//每个箱子的数组
        public int Container_num { get; set; }
        public Program(Container[] c, CargoNum[] cargoNums)
        {
            containers = c;
            cargos_num = cargoNums;
            Container_num = c.Length;
        }
    }
}