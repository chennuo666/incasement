using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;

namespace incasement.Models
{
    public class Cargo:Box//每一个箱子
    {
        public int _type { get; set; }
        public Cargo(double l, double w, double h, double x, double y, double z,int t,double weight) : base(l, w, h, x, y, z,weight)
        {
            _type = t;
        }
        public Cargo Clone()
        {
            return (Cargo)this.MemberwiseClone();
        }
    }
    public class CargoNum//每一类箱子
    {
        public double length { get; set; }
        public double width { get; set; }
        public double height { get; set; }
        public double Area { get; set; }
        public double vol { get; set; }
        public int num { get; set; }
        public int type { get; set; }//仅模型颜色用到
        public double weight { get; set; }//重量
        public CargoNum(double l, double w, double h,int num,int t,double weight)
        {
            this.weight = weight;
            this.num = num;
            type = t;
            if (l >= w && l >= h)
            {
                length = l;
                if (w >= h)
                {
                    width = w;
                    height = h;
                }
                else
                {
                    width = h;
                    height = w;
                }
            }
            else if (w >= l && w >= h)
            {
                length = w;
                if (l >= h)
                {
                    width = l;
                    height = h;
                }
                else
                {
                    width = h;
                    height = l;
                }
            }
            else
            {
                length = h;
                if (l >= w)
                {
                    width = l;
                    height = w;
                }
                else
                {
                    width = w;
                    height = l;
                }
            }
            Area = length * width;
            vol = length * width * height;
        }
        public double calArea()//计算底面积
        {
            //排序
            double l = length;
            double w = width;
            double h = height;
            if (l >= w && l >= h)
            {
                length = l;
                if (w >= h)
                {
                    width = w;
                    height = h;
                }
                else
                {
                    width = h;
                    height = w;
                }
            }
            else if (w >= l && w >= h)
            {
                length = w;
                if (l >= h)
                {
                    width = l;
                    height = h;
                }
                else
                {
                    width = h;
                    height = l;
                }
            }
            else
            {
                length = h;
                if (l >= w)
                {
                    width = l;
                    height = w;
                }
                else
                {
                    width = w;
                    height = l;
                }
            }
            vol = length * width * height;
            return Area= length * width;
        }
        public CargoNum Clone()
        {
            return (CargoNum)this.MemberwiseClone();
        }
    }
}